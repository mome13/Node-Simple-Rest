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

module.exports = router;
