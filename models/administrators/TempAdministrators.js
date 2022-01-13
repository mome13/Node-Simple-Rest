const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tempAdministratorSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
		},
		fullName: {
			type: String,
		},
		confirmOTP: {
			type: Number,
		},
		registerStep: {
			type: Number,
		},
		createdAt: { type: Date, default: Date.now, index: { expires: 18000 } }, // after 5h delete this
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('TempAdministrator', tempAdministratorSchema);
