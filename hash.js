const crypto = require('crypto');
const blength = 5e5;

module.exports = makeRandomSha;

function makeRandomSha(){
	return makeShaFromSource(crypto.randomBytes(blength));
};

makeRandomSha.shaFromValue = makeShaFromSource;

function makeShaFromSource(value) {
	return crypto.createHash('sha256')
		.update(value)
		.digest('hex')
		.toString();
}
