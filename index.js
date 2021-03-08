#!/usr/bin/env node
const config = require('./package.json');
const commander = require('commander');
const program = commander.program;
const nanoid = require('./nanoid');

program
	.version(config.version)
	.option('-l, --length <number>', 'Length of the generated string', parseInt('length must be an integer number'), 6)
	.option('-t, --type <type>', 'Type of generated string, one of: hex, alpha, digits', 'hex');

program.parse();

const options = program.opts();

switch (options.type) {
	case 'hex':
	case 'h':
		console.log(nanoid.hex(options.length));
		break;
	case 'alphanumeric':
	case 'alpha':
	case 'a':
		console.log(nanoid.alphanumeric(options.length));
		break;
	case 'digits':
	case 'd':
		console.log(nanoid.numeric(options.length));
		break;
	default:
		break;
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
