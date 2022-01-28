const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev'){
		console.log(error);
	}
	res.status(error.statusCode || 500).json({
		message: error.message || 'Server Error',
	});
};

module.exports = errorHandler;
