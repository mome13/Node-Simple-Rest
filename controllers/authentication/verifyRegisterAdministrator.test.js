const { chai, server } = require('../../test/testConfig');
const TempAdministrators = require('../../models/administrators/TempAdministrators');

describe('Register', () => {
	const testData = {
		email: 'mehran@test.com',
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
					res.should.have.status(200);
					// res.should.have.property('message').eql('Admin verified');
					done();
				});
		});
	});
});
