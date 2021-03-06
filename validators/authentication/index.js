const { Joi } = require('express-validation');

exports.registerValidation = (method) => {
	switch (method) {
	case 'register':
		return {
			body: Joi.object({
				email: Joi.string().email().required(),
				password: Joi.string().required(),
				passwordConfirmation: Joi.string().required(),
				fullName: Joi.string().required(),
			}),
		};

	case 'register-resend':
		return {
			body: Joi.object({
				email: Joi.string().email().required(),
			}),
		};

	case 'verify-register':
		return {
			body: Joi.object({
				email: Joi.string().email().required(),
				OTP: Joi.number().required(),
			}),
		};

	case 'login':
		return {
			body: Joi.object({
				email: Joi.string().email().required(),
				password: Joi.string().required(),
			}),
		};
	}
};
