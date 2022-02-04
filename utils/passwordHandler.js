const bcrypt = require('bcryptjs');

exports.createPasswordHash = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

exports.isValidPassword = (enteredPassword, hash) => {
	return bcrypt.compareSync(enteredPassword, hash)
};
