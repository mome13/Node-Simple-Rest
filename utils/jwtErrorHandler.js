const jwt = require('jsonwebtoken');
const { BaseError } = require('./index');
const { TokenExpiredError } = jwt;
module.exports = (err) => {
	if (err instanceof TokenExpiredError) {
		throw new BaseError(401, 'Unauthorized! Access Token was expired!');
	}
	throw new BaseError(401, 'Unauthorized!');
}