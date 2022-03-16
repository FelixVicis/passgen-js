#!/usr/bin/env node
const config = require('./package.json');
const commander = require('commander');
const program = commander.program;
const nanoid = require('./nanoid');
const uuid = require('uuid');

program
	.version(config.version)
	.option('-l, --length <number>', 'Length of the generated string', parseInt('length must be an integer number'), 6)
	.option('-t, --type <type>', 'Type of generated string, one of: hex, alpha, digits, insensitive, lower, base36, uuid', 'hex')
	.option('-c, --count <number>', 'Number of ids generated, must be greater than zero', parseInt('count must be an integer number'), 1)
	.option('-p, --prefix <string>', 'String to prefix ids with', '')
	.option('-pp, --postfix <string>', 'String to postfix ids with', '')
	.option('--pipe', 'Print pipe safe', !process.stdout.isTTY)
	.option('--no-pipe', 'Prints with trailing newline');

program.parse();

const options = program.opts();
let generator = null;

switch (options.type) {
	case 'hex':
	case 'h':
		generator = nanoid.hex;
		break;
	case 'alphanumeric':
	case 'alpha':
	case 'clean':
	case 'a':
		generator = nanoid.clean;
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
	case 'lower':
	case 'll':
		generator = nanoid.lower;
		break;
	case 'uuidv4':
	case 'uuid':
	case 'u':
		options.prefix = '';
		options.postfix = '';
		generator = () => uuid.v4();
		break;
	default:
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
