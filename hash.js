const crypto = require('crypto');
const blength = 5e5;

module.exports = function rand_sha(){
	return crypto.createHash('sha256')
		.update(crypto.randomBytes(blength))
		.digest('hex')
		.toString();
};
