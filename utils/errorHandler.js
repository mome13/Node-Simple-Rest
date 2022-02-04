const utils = require('./index');
const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	if (utils.isTestOrDevEnv()) {
		console.log(error);
	}
	res.status(error.statusCode || 500).json({
		message: error.message || 'Server Error',
	});
};

module.exports = errorHandler;
