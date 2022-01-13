const { asyncHandler, BaseError, passwordHandler } = require('../../utils');
const TempAdministrators = require('../../models/administrators/TempAdministrators');
const Administrators = require('../../models/administrators/Administrators');

exports.createAdministrator = asyncHandler(async (req, res) => {
	const { email, password, fullName } = req.body;

	const hashedPassword = passwordHandler.createPasswordHash(password);
	const alreadyTempAdmin = await checkRegisteredEmails(email);
	const newAdministrator = await createTempAdminObject(alreadyTempAdmin, {
		email,
		password: hashedPassword,
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
	let newAdmin;
	if (alreadyTempAdmin) {
		await TempAdministrators.updateOne(
			{ _id: alreadyTempAdmin._id },
			{ password, fullName }
		);
		return alreadyTempAdmin;
	}
	newAdmin = new TempAdministrators({
		email,
		password,
		fullName,
	});
	await newAdmin.save();
	return newAdmin;
}
