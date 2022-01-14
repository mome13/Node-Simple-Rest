const { asyncHandler, BaseError } = require('../../utils');
const TempAdministrators = require('../../models/administrators/TempAdministrators');
const Administrators = require('../../models/administrators/Administrators');

module.exports = asyncHandler(async function verifyRegister(req, res) {
	const { OTP, email } = req.body;

	const isValid = await validateOTP(OTP, email);

	if (!isValid) throw new BaseError(404, 'The OTP code is not correct.');

	const newPermanentAdmin = await makeTempAdminPermanent(isValid);

	return res.json({
		message: 'Admin verified',
		fullName: newPermanentAdmin.fullName,
	});
});

async function validateOTP(OTP, email) {
	const adminWithOTP = await TempAdministrators.findOneAndDelete({
		email,
		confirmOTP: OTP,
	});

	return adminWithOTP;
}

async function makeTempAdminPermanent(tempAdmin) {
	const permanentAdmin = new Administrators({
		_id: tempAdmin._id,
		fullName: tempAdmin.fullName,
	});
	await permanentAdmin.save();
	return permanentAdmin;
}
