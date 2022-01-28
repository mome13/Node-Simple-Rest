const { chai, server } = require('../../test/testConfig');
const TempAdministrators = require('../../models/administrators/TempAdministrators');
const Administrators = require('../../models/administrators/Administrators');

describe('Register', () => {
	before((done) => {
		TempAdministrators.deleteMany({}, (err) => {
			if (err) done(err);
			done();
		});
	});

	const testData = {
		fullName: 'test',
		password: 'Test@123',
		passwordConfirmation: 'Test@123',
		email: 'maitraysuthar@test12345.com',
	};

	it('It should send validation error for Register', (done) => {
		chai
			.request(server)
			.post('/api/auth/register')
			.send({ email: testData.email })
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	describe('/POST Register', () => {
		it('It should Register user', (done) => {
			chai
				.request(server)
				.post('/api/auth/register')
				.send(testData)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message').eql('Admin created!');
					done();
				});
		});
		after((done) => {
			TempAdministrators.deleteOne({ email: testData.email }, null, (err) => {
				if (err) done(err);
				done();
			});
		});
	});

	describe('/POST Register', () => {
		const user = {
			email: 'mehran13test@gmail.com',
			password: 'mehrani',
			passwordConfirmation: 'mehrani',
			fullName: 'mehran mehrani',
		};
		before((done) => {
			const newAdmin = new Administrators({
				email: user.email,
				password: user.password,
				fullName: user.fullName,
			});
			newAdmin.save().then(done());
		});
		it('It should not register duplicate user', (done) => {
			chai
				.request(server)
				.post('/api/auth/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('message').eql('duplicate email');
					done();
				});
		});
		after((done) => {
			Administrators.deleteOne({ email: user.email }, null, (err) => {
				if (err) done(err);
				done();
			});
		});
	});
});
