const { csprng } = require('./service');
const cache = {
	source:null,
};

function lipsum() {
	return get_ipsum().paragraph[0] + ".";
}

lipsum.paragraph = paragraph;
lipsum.sentance = sentance;
lipsum.word = word;

module.exports = lipsum;

function paragraph(len = 3, startWithIpsum = true) {
	return _strof(len, ips_paragraph, startWithIpsum ? get_ipsum().paragraph[0] : '', 1, ".\n", '');
}

function sentance(len = 5, startWithIpsum = true) {
	return _strof(len, ips_sentance, startWithIpsum ? get_ipsum().sentance[0] : '', 1, '.', '');
}

function word(len = 9, startWithIpsum = true) {
	return _strof(len, ips_word, startWithIpsum ? get_ipsum().start : '', 5);
}

function _strof(len, callback, str = '', i1 = 1, le = '', se = '.') {
	let r = `${str}`;
	let i = str.length ? i1 : 0;
	for (i; i < len; i++) {
		if (i) r += " ";
		r+=callback();
		r+=le;
	}
	r+= se;
	return r;
}


function get_ipsum() {
	if (!cache.first)
		cache.source = fjson('./pub/lorem.json');

	return cache.source;
}
function ips_paragraph() {
	let lor = get_ipsum();

	const i = csprng(0, lor.paragraph.length - 1);

	return lor.paragraph[i];
}
function ips_sentance() {
	let lor = get_ipsum();

	const i = csprng(0, lor.sentance.length - 1);

	return lor.sentance[i];
}
function ips_word() {
	let lor = get_ipsum();

	const i = csprng(0, lor.word.length - 1);

	return lor.word[i];
}
function fjson(fd) {
	try {
		return require(fd);
	} catch (e) {
		console.warn(`No file found ${fd}`);
		return {
			start : "Lorem ipsum dolor sit amet,",
			paragraph : ["Lorem ipsum dolor sit amet"],
			sentance : ["Lorem ipsum dolor sit amet"],
			words : ["Lorem","ipsum"],
		}
	}
}
