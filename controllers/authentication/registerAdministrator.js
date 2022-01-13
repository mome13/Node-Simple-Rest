const { asyncHandler, BaseError, passwordHandler } = require('../../utils');
const TempAdministrators = require('../../models/administrators/TempAdministrators');
const Administrators = require('../../models/administrators/Administrators');

exports.createAdministrator = asyncHandler(async (req, res, next) => {
	const { email, password, fullName } = req.body;

	const hashedPassword = passwordHandler.createPasswordHash(password);
	let alreadyTempAdmin = checkRegisteredEmails(email, next);

	const newAdministrator = createTempAdminObject(alreadyTempAdmin, {
		email,
		password: hashedPassword,
		fullName,
	});

	await newAdministrator.save();

	console.log(newAdministrator)
	return res.json({
		message: 'Admin created!',
	});
});

async function checkRegisteredEmails(email, error) {
	let [duplicate, alreadyTempAdmin] = await Promise.all([
		Administrators.countDocuments({ email }),
		TempAdministrators.findOne({ email }),
	]);
	if (duplicate) return error(new BaseError(400, 'duplicate email'));

	return alreadyTempAdmin;
}

function createTempAdminObject(
	alreadyTempAdmin,
	{ email, password, fullName }
) {
	// if (alreadyTempAdmin) {
	// 	alreadyTempAdmin.password = password;
	// 	alreadyTempAdmin.fullName = fullName;
	// } else {
	alreadyTempAdmin = new TempAdministrators({
		email,
		password,
		fullName,
	});
	// }

	return alreadyTempAdmin;
}
