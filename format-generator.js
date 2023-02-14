const generators = {
	get lang() { return require('./nanoid') },
	get name() { return require('./names') },
	get int() { return require('./number-generator') },
	get float() { return require('./number-generator').float },
	get sha() { return require('./hash').shaFromValue },
	get rsha() { return require('./hash') },
	get uuid() { return require('uuid').v4 },
	get choose() { return require('./choice-generator') },
	get count() { return require('./counter-generator') },
}

const re = {
	single : /(?<domain>[a-z\-]+)(?:\.(?<fn>[a-z\-]+))?(?:\((?<params>[ a-z0-9\-\_\,\.\?\~\`\!\@\#\$\%\^\&\*\+\=\[\]\<\>\|\/]*)\))/gi,
};

module.exports = function generate(format = "") {
	return replaceSingle(format);
};

function replaceSingle(input) {
	const onMatch = ({match, domain, fn, params}) => _getRepl(match, domain, fn, params);
	const matcher = (match, c1, c2, c3, o, or, matches) => onMatch({
		match,
		domain:matches.domain,
		fn:matches.fn,
		params:matches.params.trim().split(/[ ]*,[ ]*/),
	});

	return input.replace(re.single, matcher);
}

function _getRepl(match, domain, fn, params) {
	if (!(domain in generators)) return match

	let gen = generators[domain];

	if (typeof gen[fn] !== 'function') return gen(...params);

	return gen[fn](...params);
}
