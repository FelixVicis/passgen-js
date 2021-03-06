const crypto = require('crypto');
const defaultLength = 6;
const languages = {
	hex          : '0123456789ABCDEF',
	numeric      : '0123456789',
	clean        : 'BCDFGHJKMNPQRSTUVWXYZ2346789',
	insensitive  : 'bcdfghjkmnpqrstuvwxyzBCDFGHJKMNPQRSTUVWXYZ2346789',
	alphanumeric : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
};

module.exports = nanoid;

nanoid.hex = hex;
nanoid.numeric = numeric;
nanoid.clean = clean;
nanoid.insensitive = insensitive;
nanoid.alphanumeric = alphanumeric;

function nanoid(length = defaultLength) {
	return hex(length);
}

function hex(length = defaultLength) {
	return generateStringFromLanguage(length, languages.hexadecimal);
}

function numeric(length = defaultLength) {
	return generateStringFromLanguage(length, languages.numeric);
}

function clean(length = defaultLength) {
	return generateStringFromLanguage(length, languages.clean);
}

function insensitive(length = defaultLength) {
	return generateStringFromLanguage(length, languages.insensitive);
}

function alphanumeric(length = defaultLength) {
	return generateStringFromLanguage(length, languages.alphanumeric);
}

function generateStringFromLanguage(length = 8, lang = '0123456789ABCDEF') {
	let str = '';

	while (str.length < length)
		str += lang[csprng(0, lang.length - 1)];

	return str;
}


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
