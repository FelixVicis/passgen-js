const { csprngsafe } = require('./service');

module.exports = generator;

function generator(min = 0, max = Number.MAX_SAFE_INTEGER, pad = null) {
	const value = csprngsafe(Number.parseFloat(min), Number.parseFloat(max));
	pad = Number.parseInt(pad, 10);

	if (typeof pad == 'number' && pad > 1)
		return value.toString().padStart(pad, '0');

	return value.toString();
}

generator.int = generator;
generator.float = (min = 0, max = 1, prec = null) => {
	const value = floatrange(Number.parseFloat(min) || 0, Number.parseFloat(max) || 1);

	prec = Number.parseFloat(prec);

	if (typeof prec === 'number' && prec > 0)
		return value.toFixed(prec);
	return value.toString();
};

function floatrange(min, max) {
	const range = max - min;
	const r = Math.random() * range;

	return min + r;
}
