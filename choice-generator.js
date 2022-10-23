module.exports = function choose(...options) {
	const i = Math.floor(Math.random() * options.length);

	return options[i];
};
