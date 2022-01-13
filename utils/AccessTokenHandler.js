const Administrators = require('../models/administrators/Administrators');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const ObjectId = require('mongoose').Types.ObjectId;
const ERROR_TEXT = require('../../consData/errorText');

const self = (module.exports = {
	createJwtToken(data, req, secret = 'secret') {
		const userAgent = req.headers['user-agent'];
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		const createdAt = Date.now();
		const user = {
			createdAt: createdAt,
			...data,
		};
		// do the database authentication here, with user name and password combination.
		const accessToken = jwt.sign({ user, ip, userAgent }, config[secret]);
		const refreshToken = {
			refreshToken: jwt.sign(
				Math.random().toString(36).substring(2, 15),
				config.refreshTokenSecret
			),
			createdAt: createdAt,
		};
		return { accessToken, refreshToken, userAgent };
	},
	expireRefreshToken(refreshTokenTime) {
		if (
			Date.now() - new Date(refreshTokenTime).getTime() >
			30 * 24 * 60 * 60 * 1000
		) {
			return true;
		}
	},
	async createToken(req, res, next) {
		const { refreshToken } = req.body;
		try {
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
						'refreshTokens.refreshToken': refreshToken,
					},
				},
				{ $project: { refreshTokens: 1, _id: 1, workspace: 1 } },
			]);
			if (!data) throw '';
			if (
				self.expireRefreshToken(
					data.refreshTokens.find((r) => r.refreshToken == refreshToken)
						.createdAt
				)
			) {
				res.status(403).send(ERROR_TEXT.REFRESH_TOKEN_EXPIRE);
				return;
			}
			const newToken = self.createJwtToken(
				{ _id, role: data.workspace.role },
				req
			);
			await Administrators.updateOne(
				{ _id: data._id, 'refreshTokens.refreshToken': refreshToken },
				{ $set: { 'refreshTokens.$': { ...newToken.refreshToken, userAgent } } }
			);
			res.json({
				accessToken: newToken.accessToken,
				refreshToken: newToken.refreshToken.refreshToken,
			});
		} catch (e) {
			res.status(500).json({ message: ERROR_TEXT.OCCURRED });
		}
	},
	createActivetionToken(data, secret = 'secretActivationToken') {
		const createdAt = Date.now();
		const user = {
			_id: data._id,
			createdAt: createdAt,
		};
		const accessToken = jwt.sign({ user }, config[secret]);
		return accessToken;
	},
});
