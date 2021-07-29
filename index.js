#!/usr/bin/env node
const config = require('./package.json');
const commander = require('commander');
const program = commander.program;
const nanoid = require('./nanoid');

program
	.version(config.version)
	.option('-l, --length <number>', 'Length of the generated string', parseInt('length must be an integer number'), 6)
	.option('-t, --type <type>', 'Type of generated string, one of: hex, alpha, digits', 'hex')
	.option('-c, --count <number>', 'Number of ids generated, must be greater than zero', parseInt('count must be an integer number'), 1)
	.option('-p, --prefix <string>', 'String to prefix ids with', '');

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
	case 'a':
		generator = nanoid.alphanumeric;
		break;
	case 'digits':
	case 'd':
		generator = nanoid.numeric;
		break;
	default:
		break;
}

if (generator) {
	for (let i = 0; i < options.count; i++) {
		console.log(`${options.prefix}${generator(options.length)}`);
	}
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
