const jwt = require('jsonwebtoken');
const { asyncHandler, BaseError, jwtErrorHandler } = require('../utils');

async function verifyToken(req) {
	const token = req.header('Authorization')
		? req.header('Authorization')
		: false;
	if (!token) throw new BaseError(403, 'No token provided!');
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) jwtErrorHandler(err);
		checkDecodedValues(req, decoded);
		return decoded;
	});
}

function checkDecodedValues(req, decoded) {
	if (!decoded) throw BaseError(403, 'Forbidden');
	const userAgent = req.headers['user-agent'];
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if (ip !== decoded.ip || userAgent !== decoded.userAgent)
		throw new BaseError(401, 'Unauthorized');
}

module.exports.administratorCheckToken = asyncHandler(
	async (req, res, next) => {
		const { user } = await verifyToken(req);
		req.user = user;
		next();
	}
);
