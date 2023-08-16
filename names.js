const { csprng } = require('./service');
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
