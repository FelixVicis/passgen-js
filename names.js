const crypto = require('crypto');
const cache = {
	first:null,
	last:null,
};

function fullname() {
	return `${firstname()} ${lastname()}`
}

fullname.full = fullname;
fullname.first = firstname;
fullname.last = lastname;

module.exports = fullname;


function firstname() {
	if (!cache.first)
		cache.first = fjson('./pub/firstnames.json');

	const i = csprng(0, cache.first.length - 1);

	return cache.first[i] || firstname();
}
function lastname() {
	if (!cache.last)
		cache.last = fjson('./pub/surnames.json');

	const i = csprng(0, cache.last.length - 1);

	return cache.last[i] || lastname();
}
function fjson(fd) {
	try {
		return require(fd);
	} catch (e) {
		console.warn(`No file found ${fd}`);
		return ['Bob']
	}
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
