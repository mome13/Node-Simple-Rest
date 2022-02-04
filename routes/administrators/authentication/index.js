const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const { createAdministrator, resendCode, verifyRegisterAdministrator, login } = require('../../../controllers/authentication');
const { passwordChecker } = require('../../../middlewares');

const { registerValidation } = require('../../../validators/authentication');

router.post(
	'/register',
	validate(registerValidation('register')),
	passwordChecker.checkPasswordEquality,
	createAdministrator
);

router.post(
	'/register-resend',
	validate(registerValidation('register-resend')),
	resendCode
);

router.post(
	'/verify-register',
	validate(registerValidation('verify-register')),
	verifyRegisterAdministrator
);

router.post(
	'/login',
	validate(registerValidation('login')),
	login
);

module.exports = router;
