module.exports.register = {
	createAdministrator: require('./registerAdministrator').createTempAdministrator,
	resendCode: require('./registerAdministrator').resendCode,
	verifyRegisterAdministrator: require('./verifyRegisterAdministrator')
}