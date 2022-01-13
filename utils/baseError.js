class BaseError extends Error {
	constructor(statusCode, message) {
		super(message);
		this.statusCode = statusCode;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = BaseError;
