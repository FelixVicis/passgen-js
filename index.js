#!/usr/bin/env node
const config = require('./package.json');
const commander = require('commander');
const program = commander.program;
const helptext = require('./text.json');
const nanoid = require('./nanoid');
const uuid = require('uuid');
const sha = require('./hash');
const nameGen = require('./names');
const fmtGen = require('./format-generator');

program
	.version(config.version)
	.option('-l, --length <number>', 'Length of the generated string', parseInt('length must be an integer number'), 6)
	.option('-t, --type <type>', 'Type of generated string, one of: hex, alpha, digits, insensitive, lower, base36, uuid, sha256, fmt', 'hex')
	.option('-c, --count <number>', 'Number of ids generated, must be greater than zero', parseInt('count must be an integer number'), 1)
	.option('-p, --prefix <string>', 'String to prefix ids with', '')
	.option('-pp, --postfix <string>', 'String to postfix ids with', '')
	.option('--pipe', 'Print pipe safe', !process.stdout.isTTY)
	.option('--no-pipe', 'Prints with trailing newline')
	.option('--language <string>', 'Custom Language string to use')
	.option('--format <string>', 'Format String for complex generation');

program.addHelpText('after',helptext.helpTextAfterGenerators + helptext.helpTextAfterFmt);

program.parse();

const options = program.opts();

if (options.language)
	options.type = 'custom';
if (options.format)
	options.type = 'fmt';

let generator = null;

switch (options.type) {
	case 'hex':
	case 'h':
		generator = nanoid.lhex;
		break;
	case 'HEX':
	case 'H':
		generator = nanoid.hex;
		break;
	case 'alphanumeric':
	case 'alpha':
	case 'clean':
	case 'a':
	case 'lower':
	case 'll':
	case 'l':
		generator = nanoid.lower;
		break;
	case 'insensitive':
	case 'insen':
	case 'i':
		generator = nanoid.insensitive;
		break;
	case 'base36':
	case '36':
		generator = nanoid.alphanumeric;
		break;
	case 'digits':
	case 'd':
		generator = nanoid.numeric;
		break;
	case 'upper':
		generator = nanoid.clean;
		break;
	case 'unicode':
	case 'uni':
		generator = nanoid.unicode;
		break;
	case 'symbols':
	case 'sym':
		generator = nanoid.symbols;
		break;
	case 'uuidv4':
	case 'uuid':
	case 'u':
		options.prefix = '';
		options.postfix = '';
		generator = () => uuid.v4();
		break;
	case 'sha256':
	case 'sha':
		generator = () => sha();
		break;
	case 'name':
	case 'n':
		generator = () => nameGen();
		break;
	case 'firstname':
	case 'first':
	case 'fn':
		generator = () => nameGen.first();
		break;
	case 'lastname':
	case 'last':
	case 'surname':
	case 'ln':
		generator = () => nameGen.last();
		break;

	case 'custom':
		generator = l => nanoid.custom(l, expandLanguage(options.language));
		break;
	case 'fmt':
		if (options.format)
			generator = () => fmtGen(options.format);
		break;
	default:
		console.warn(`Unknown generator '${options.type}'`);
		break;
}

if (generator) {
	const list = [];

	for (let i = 0; i < options.count; i++) {
		list.push(`${options.prefix}${generator(options.length)}${options.postfix}`);
	}

	list.forEach((item, i) => {
		if (options.pipe) {
			if (i > 0) { process.stdout.write('\n'); }
			process.stdout.write(item);
		} else {
			console.log(item);
		}
	})
}

function parseInt(message) {
	return (value) => {
		const int = Number.parseInt(value, 10);

		if (Number.isNaN(int))
		 	throw new commander.InvalidOptionArgumentError(message);

		return int;
	}
}

function parseList(possible, message) {
	return (value) => {
		if (possible.includes(value)) return value;

		throw new commander.InvalidOptionArgumentError(message);
	}
}

function expandLanguage(language) {
	const reRun = /([0-9])\-([1-9])|([a-z])\-([b-z])|([A-Z])\-([B-Z])/g

	return language.replace(reRun, (match) => {
		const [left, right] = match.split('-');
		if (left >= right) return match;

		return srange(left, right);
	});

	function srange(left, right) {
		const l = right.codePointAt() - left.codePointAt() + 1;
		const base = left.codePointAt();

		return new Array(l)
			.fill(base)
			.map((b,i) => String.fromCharCode(b+i))
			.join('');
	}
}
