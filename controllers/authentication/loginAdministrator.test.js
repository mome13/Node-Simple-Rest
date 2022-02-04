const { chai, server } = require('../../test/testConfig');
const Administrators = require('../../models/administrators/Administrators');
const {
	passwordHandler: { createPasswordHash },
} = require('../../utils');
const {
	TEXTS: { LoginComplete, IncorrectPassword },
} = require('../../constants');

describe('Login', () => {
	const testData = {
		fullName: 'test',
		password: '123456',
		passwordConfirmation: '123456',
		email: 'testLogin@test.com',
	};

	describe('/POST Login', () => {
		before((done) => {
			const newAdmin = new Administrators({
				email: testData.email,
				password: createPasswordHash(testData.password),
				fullName: testData.fullName,
			});
			newAdmin.save().then(() => {
				setTimeout(() => {
					done();
				}, 500);
			});
		});

		it('It throw validation error without email', (done) => {
			chai
				.request(server)
				.post('/api/auth/login')
				.send({  password: 'password' })
				.end((err, res) => {
					if (err) {
						done(err);
					}
					res.should.have.status(400);
					done();
				});
		});

		it('It throw validation error without password', (done) => {
			chai
				.request(server)
				.post('/api/auth/login')
				.send({ email: testData.email })
				.end((err, res) => {
					if (err) {
						done(err);
					}
					res.should.have.status(400);
					done();
				});
		});

		it('It should NOT Login user with incorrect credentials', (done) => {
			chai
				.request(server)
				.post('/api/auth/login')
				.send({ email: testData.email, password: 'password' })
				.end((err, res) => {
					if (err) {
						done(err);
					}
					res.should.have.status(404);
					res.body.should.have.property('message').eql(IncorrectPassword);
					done();
				});
		});

		it('It should Login user with correct credentials', (done) => {
			chai
				.request(server)
				.post('/api/auth/login')
				.send({ email: testData.email, password: testData.password })
				.end((err, res) => {
					if (err) {
						done(err);
					}
					res.should.have.status(200);
					res.body.should.have.property('message').eql(LoginComplete);
					res.body.should.have.property('accessToken');
					res.body.should.have.property('refreshToken');
					res.body.should.have.property('fullName');
					done();
				});
		});
		after((done) => {
			Administrators.findOneAndDelete({ email: testData.email }).then(() =>
				done()
			);
		});
	});
});
