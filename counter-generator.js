let i = 1;
let isset = false;

function counter(startAt = '', pad = '') {
	if (!isset) {
		isset=true;

		let n = Number.parseInt(startAt, 10);

		if (!isNaN(n)) i = n;
	}

	_pad = Number.parseInt(pad, 10);

	if (pad > 0) {
		return `${i++}`.padStart(pad, '0');
	}
	return i++;
};
counter.pad = (pad = 2, startAt = '') => counter(startAt, pad);

module.exports = counter;
