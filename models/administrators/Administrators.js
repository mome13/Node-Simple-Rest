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
		registerStep: {
			type: Number,
		},
		refreshToken: {
			createdAt: {
				type: Date,
			},
			value: {
				type: String,
			},
			userAgent: {
				type: String,
			},
		},
		createdAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Administrator', tempAdministratorSchema);
