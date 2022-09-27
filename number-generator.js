const crypto = require('crypto');

module.exports = generator;

function generator(min = 0, max = Number.MAX_SAFE_INTEGER, pad = null) {
	const value = csprng(Number.parseFloat(min), Number.parseFloat(max));
	pad = Number.parseInt(pad, 10);

	if (typeof pad == 'number' && pad > 1)
		return value.toString().padStart(pad, '0');

	return value.toString();
}

generator.int = generator;
generator.float = (min = 0, max = 1, prec = null) => {
	const value = floatrange(Number.parseFloat(min), Number.parseFloat(max));

	prec = Number.parseFloat(prec);

	if (typeof prec === 'number' && prec > 0)
		return value.toFixed(prec);
	return value.toString();
};

function csprng(min, max) { // eslint-disable-line max-statements
	/* eslint-disable no-bitwise, no-mixed-bitwise, no-mixed-operators */
	// Adapted from https://github.com/joepie91/node-random-number-csprng

	const range = max - min;

	let tmp = range;
	let bitsNeeded = 0;
	let bytesNeeded = 0;
	let mask = 1;

	while (tmp > 0) {
		if (bitsNeeded % 8 === 0) bytesNeeded += 1;
		bitsNeeded += 1;
		mask = mask << 1 | 1;
		tmp >>>= 1;
	}
	const randomBytes = crypto.randomBytes(bytesNeeded);

	let randomValue = 0;

	for (let i = 0; i < bytesNeeded; i++)
		randomValue |= randomBytes[i] << 8 * i;

	randomValue &= mask;

	if (randomValue <= range)
		return min + randomValue;

	return csprng(min, max);
}

function floatrange(min, max) {
	const range = max - min;
	const r = Math.random() * range;

	return min + r;
}
