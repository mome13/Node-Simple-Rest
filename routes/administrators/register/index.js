const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const { registerValidation } = require('../../validators/registration/index');

router.post('/', validate(registerValidation('register')), createAdministrator);

module.exports = router;
