const { asyncHandler, BaseError, passwordHandler, OTPHandler } = require('../../utils');
const TempAdministrators = require('../../models/administrators/TempAdministrators');
const Administrators = require('../../models/administrators/Administrators');

module.exports = asyncHandler(async function register(req, res) {
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
	const confirmOTP = OTPHandler.createOTP()
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
		confirmOTP
	});
	await newAdmin.save();
	return newAdmin;
}
