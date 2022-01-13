const bcrypt = require('bcryptjs');

exports.createPasswordHash = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};
