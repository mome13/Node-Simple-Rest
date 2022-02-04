const {
	asyncHandler,
	BaseError,
	passwordHandler,
	OTPHandler,
	isTestOrDevEnv,
} = require('../../utils');
const TempAdministrators = require('../../models/administrators/TempAdministrators');
const Administrators = require('../../models/administrators/Administrators');

const createTempAdministrator = asyncHandler(async function (req, res) {
	const { email, password, fullName } = req.body;

	const alreadyTempAdmin = await checkRegisteredEmails(email);
	const newAdministrator = await createTempAdminObject(alreadyTempAdmin, {
		email,
		password,
		fullName,
	});

	return res.json({
		message: 'Admin created!',
		fullName: newAdministrator.fullName,
	});
});

const resendCode = asyncHandler(async function (req, res) {
	const { email } = req.body;

	const confirmOTP = await setNewOTP(email);
	if (isTestOrDevEnv()) console.log('your new ConfirmOTP', confirmOTP);

	return res.json({
		message: 'OTP Updated!',
	});
});

async function setNewOTP(tempAdminEmail) {
	const confirmOTP = OTPHandler.createOTP();
	await TempAdministrators.findOneAndUpdate(
		{ email: tempAdminEmail },
		{ confirmOTP }
	);
	return confirmOTP;
}

async function checkRegisteredEmails(email) {
	const [duplicate, alreadyTempAdmin] = await Promise.all([
		Administrators.countDocuments({ email }),
		TempAdministrators.findOne({ email }),
	]);
	if (duplicate) throw new BaseError(400, 'duplicate email');

	return alreadyTempAdmin;
}

async function createTempAdminObject(
	alreadyTempAdmin,
	{ email, password, fullName }
) {
	const hashedPassword = passwordHandler.createPasswordHash(password);
	const confirmOTP = OTPHandler.createOTP();
	if (alreadyTempAdmin) {
		await TempAdministrators.updateOne(
			{ _id: alreadyTempAdmin._id },
			{ password: hashedPassword, fullName, confirmOTP }
		);
		return alreadyTempAdmin;
	}
	const newAdmin = new TempAdministrators({
		email,
		password: hashedPassword,
		fullName,
		confirmOTP,
	});
	await newAdmin.save();
	return newAdmin;
}

module.exports = {
	createTempAdministrator,
	resendCode,
};
