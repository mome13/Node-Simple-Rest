module.exports = {
	createAdministrator: require('./registerAdministrator').createTempAdministrator,
	resendCode: require('./registerAdministrator').resendCode,
	verifyRegisterAdministrator: require('./verifyRegisterAdministrator'),
	login: require('./loginAdministrator'),
}