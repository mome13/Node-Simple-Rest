module.exports = function(){
	return process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test';
};