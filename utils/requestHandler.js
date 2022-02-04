module.exports.extractUserAgentAndIp = function(req) {
	const userAgent = req.headers['user-agent'];
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	return {userAgent, ip}
}