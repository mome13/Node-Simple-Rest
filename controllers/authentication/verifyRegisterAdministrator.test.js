const { chai, server } = require('../../test/testConfig');
const TempAdministrators = require('../../models/administrators/TempAdministrators');
const Administrators = require('../../models/administrators/Administrators');

describe('Register Verification', () => {
	const testData = {
		email: 'mehran13Verify@test.com',
		fullName: 'mehrani',
		OTP: 1234,
	};

	describe('/POST Verify Register', () => {
		before((done) => {
			const newAdmin = new TempAdministrators({
				email: testData.email,
				fullName: testData.fullName,
				confirmOTP: testData.OTP,
			});

			newAdmin.save().then(() => {
				done();
			});
		});

		it('It should verify the code sent to the user', (done) => {
			chai
				.request(server)
				.post('/api/auth/verify-register')
				.send({ email: testData.email, OTP: testData.OTP })
				.end((err, res) => {
					if (err) done(err);
					res.should.have.status(200);
					done();
				});
		});

		after((done) => {
			Administrators.deleteOne({ email: testData.email }, null, (err) => {
				if (err) done(err);
				done();
			});
		});
	});
});
