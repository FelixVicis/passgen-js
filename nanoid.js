const crypto = require('crypto');
const defaultLength = 6;
const languages = {
	hex          : '0123456789ABCDEF',
	lhex         : '0123456789abcdef',
	numeric      : '0123456789',
	clean        : 'BCDFGHJKMNPQRSTUVWXYZ2346789',
	insensitive  : 'bcdfghjkmnpqrstuvwxyzBCDFGHJKMNPQRSTUVWXYZ2346789',
	lower        : 'bcdfghjkmnpqrstuvwxyz2346789',
	alphanumeric : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	symbols      : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_-=+{}[]|:;<>,.?',
};

module.exports = nanoid;

Object.entries(languages)
	.forEach(([key, language]) => {
		nanoid[key] = generate(language);
	});

nanoid['unicode'] = (length) => generateStringFromUnicode(Number.parseInt(length, 10));
nanoid['custom'] = (length, language) => generateStringFromLanguage(Number.parseInt(length, 10), expandLanguage(language));

function nanoid(length = defaultLength) {
	return nanoid.hex(Number.parseInt(length));
}

function generate(language) {
	return function (length = defaultLength) {
		return generateStringFromLanguage(Number.parseInt(length, 10), language);
	}
}

function generateStringFromLanguage(length = 8, lang = '0123456789ABCDEF') {
	let str = '';

	while (str.length < length)
		str += lang[csprng(0, lang.length - 1)];

	return str;
}

function generateStringFromUnicode(length = 8) {
	let arr = [];

	while (arr.length < length)
		arr.push(csprng(0, 0xFFFF));

	return String.fromCharCode(...arr);
}

function expandLanguage(lang) {
	return lang.replace(
		/([A-Za-z0-9])\-([A-Za-z0-9])/g,
		(match, start, end) => {
			const startCode = start.charCodeAt(0);
			const endCode   = end.charCodeAt(0);

			// Must be same character class
			const sameType =
				(/[A-Z]/.test(start) && /[A-Z]/.test(end)) ||
				(/[a-z]/.test(start) && /[a-z]/.test(end)) ||
				(/[0-9]/.test(start) && /[0-9]/.test(end));

			// Must be ascending
			if (!sameType || startCode > endCode) {
				return match;
			}

			let expanded = '';
			for (let i = startCode; i <= endCode; i++) {
				expanded += String.fromCharCode(i);
			}

			return expanded;
		}
	);
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
