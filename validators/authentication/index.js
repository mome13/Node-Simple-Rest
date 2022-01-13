const { Joi } = require('express-validation');

exports.registerValidation = (method) => {
	switch (method) {
	case 'register':
		return {
			body: Joi.object({
				email: Joi.string().email().required(),
				password: Joi.string().required(),
				passwordConfirmation: Joi.string().required(),
				fullName: Joi.string().required()
			}),
		};
	}
};
