const {
	asyncHandler,
	BaseError,
	passwordHandler,
	accessTokenHandler: { createJwtToken },
} = require('../../utils');
const administrators = require('../../models/administrators/Administrators');
const { IncorrectPassword, LoginComplete } = require('../../constants/texts');

module.exports = asyncHandler(async function (req, res) {
	const { email, password } = req.body;
	const admin = await getAdminByEmail(email);
	validateAdminPassword(admin, password);
	const { accessToken, refreshToken, userAgent } = createJwtToken(
		{ _id: admin._id },
		req
	);

	await updateRefreshToken(admin._id, userAgent, refreshToken);

	return res.json({
		message: LoginComplete,
		accessToken,
		refreshToken: refreshToken.value,
		fullName: admin.fullName,
	});
});

async function getAdminByEmail(email) {
	const [data] = await administrators.aggregate([
		{ $match: { email: email.toLowerCase() } },
		{
			$project: {
				email: 1,
				password: 1,
				fullName: 1,
			},
		},
	]);

	return data;
}

async function updateRefreshToken(_id, userAgent, newRefreshToken) {
	await administrators.updateOne(
		{ _id, 'refreshToken.userAgent': userAgent },
		{ refreshToken: { ...newRefreshToken, userAgent } }
	);
}

function validateAdminPassword(admin, password) {
	if (
		!admin ||
		!admin.password ||
		!passwordHandler.isValidPassword(password, admin.password)
	) {
		console.log(admin, password)
		throw new BaseError(404, IncorrectPassword);
	}
}
