const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const { register } = require('../../../controllers/authentication');
const { passwordChecker } = require('../../../middlewares');

const { registerValidation } = require('../../../validators/authentication');

router.post(
	'/register',
	validate(registerValidation('register')),
	passwordChecker.checkPasswordEquality,
	register.createAdministrator
);

router.post(
	'/register-resend',
	validate(registerValidation('register-resend')),
	register.resendCode
);

router.post(
	'/verify-register',
	validate(registerValidation('verify-register')),
	register.verifyRegisterAdministrator
);

module.exports = router;
