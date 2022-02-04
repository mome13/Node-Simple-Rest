const Administrators = require('../models/administrators/Administrators');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const {
	TEXTS: { RefreshTokenExpired },
} = require('../constants');
const { extractUserAgentAndIp } = require('./requestHandler');
const { TIMES } = require('../constants');
const { v4: uuidv4 } = require('uuid');

function createJwtToken(data, req) {
	const { userAgent, ip } = extractUserAgentAndIp(req);
	const createdAt = Date.now();
	const user = {
		createdAt,
		...data,
	};
	const accessToken = createAccessToken({ user, ip, userAgent });
	const randomString = uuidv4();
	const refreshTokenValue = createRefreshToken({ randomString });
	const refreshToken = { value: refreshTokenValue, createdAt };
	return { accessToken, refreshToken, userAgent };
}

function createAccessToken(jwtPayload) {
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_TIMEOUT_DURATION,
	});
}

function createRefreshToken(jwtPayload) {
	return jwt.sign(jwtPayload, process.env.JWT_REFRESH_TOKEN_SECRET);
}

async function RefreshToken(req, res) {
	const { refreshToken } = req.body;
	const token = req.header('Authorization')
		? req.header('Authorization').replace('Bearer ', '')
		: false;
	if (!token || !refreshToken || typeof refreshToken !== 'string') throw '';
	const decoded = await jwt.verify(token, config.secret);
	const userAgent = req.headers['user-agent'];
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if (
		!decoded ||
		ip !== decoded.ip ||
		userAgent !== decoded.userAgent ||
		decoded.user.role === 'user'
	)
		throw '';
	const { _id } = decoded.user;
	const [data] = await Administrators.aggregate([
		{
			$match: {
				_id: ObjectId(_id),
				'refreshTokens.value': refreshToken,
			},
		},
		{ $project: { refreshTokens: 1, _id: 1 } },
	]);
	if (!data) throw '';
	if (
		isRefreshTokenExpired(
			data.refreshTokens.find((r) => r.refreshToken == refreshToken).createdAt
		)
	) {
		res.status(403).send(RefreshTokenExpired);
		return;
	}
	const newToken = createJwtToken({ _id, role: data.workspace.role }, req);
	await Administrators.updateOne(
		{ _id: data._id, 'refreshTokens.refreshToken': refreshToken },
		{ $set: { 'refreshTokens.$': { ...newToken.refreshToken, userAgent } } }
	);
	res.json({
		accessToken: newToken.accessToken,
		refreshToken: newToken.refreshToken.refreshToken,
	});
}

function isRefreshTokenExpired(refreshTokenTime) {
	return (
		Date.now() - new Date(refreshTokenTime).getTime() >
		TIMES[process.env.JWT_REFRESH_TOKEN_TIMEOUT_DURATION]
	);
}

module.exports = {
	createJwtToken,
};
