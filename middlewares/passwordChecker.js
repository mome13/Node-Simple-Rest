module.exports.checkPasswordEquality = (req, res, next) => {
	const { password, passwordConfirmation } = req.body;

	password === passwordConfirmation
		? next()
		: res.status(400).json({ message: 'passwords are not equal!' });
};