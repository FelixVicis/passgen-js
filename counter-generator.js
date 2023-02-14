let i = 1;
let isset = false;

module.exports = function counter(param) {
	if (!isset) {
		isset=true;

		let n = Number.parseInt(param, 10);

		if (!isNaN(n)) i = n;
	}

	return i++;
};
