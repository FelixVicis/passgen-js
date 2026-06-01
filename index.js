#!/usr/bin/env node
const config = require('./package.json');
const commander = require('commander');
const program = commander.program;
const helptext = require('./text.json');
const fmtGen = require('./format-generator');
const shortcuts = require('./shortcuts');

program
	.version(config.version)
	.option('-l, --length <number>', 'Length of the generated string', parseInt('length must be an integer number'), 6)
	.option('-t, --type <type>', 'Shortcut generator type, or fmt with --format', 'hex')
	.option('-c, --count <number>', 'Number of ids generated, must be greater than zero', parseInt('count must be an integer number'), 1)
	.option('-p, --prefix <string>', 'String to prefix ids with', '')
	.option('-pp, --postfix <string>', 'String to postfix ids with', '')
	.option('--pipe', 'Print pipe safe', !process.stdout.isTTY)
	.option('--no-pipe', 'Prints with trailing newline')
	.option('--language <string>', 'Custom Language string to use')
	.option('--format <string>', 'Format String for complex generation')
	.option('--format-pipe', 'Format String provided via stdin', !process.stdin.isTTY)
	.option('--no-format-pipe', 'Do not use stdin as format string');

program.addHelpText('after', shortcuts.help() + helptext.helpTextAfterFmt);

program.parse();

main(program).catch(error => console.error(error));

async function main(program) {
	const options = program.opts();

	// Determine Options
	if (options.language)
		options.type = 'custom';
	if (options.format)
		options.type = 'fmt';
	if (options.formatPipe && !options.noFormatPipe) {
		options.type = 'fmt';
		options.format = await promiseStdin();
	}

	const generator = getGenerator(options);

	if (!generator) { return; }

	const generate = () => `${options.prefix}${generator()}${options.postfix}`;
	for (let i = 0; i < options.count; i++) {
		if (options.pipe) {
			if (i > 0) { process.stdout.write('\n'); }
				process.stdout.write(generate());
		}
		else
			console.log(generate());
	}
}

function getGenerator(options) {
	if (options.type === 'fmt')
		return options.format ? () => fmtGen(options.format) : null;

	const shortcut = shortcuts.get(options.type, options);

	if (!shortcut) {
		console.warn(`Unknown generator '${options.type}'`);
		return null;
	}

	if (shortcut.prefix !== undefined)
		options.prefix = shortcut.prefix;

	if (shortcut.postfix !== undefined)
		options.postfix = shortcut.postfix;

	return () => fmtGen(shortcut.format);
}

async function promiseStdin($encoding = 'utf8') {
	if (process.stdin.isTTY) {
		return '';
	}

	process.stdin.setEncoding($encoding);

	return new Promise((resolve, reject) => {
		let input = '';

		process.stdin.on('data', (chunk) => { input += chunk; });
		process.stdin.on('end', () => { resolve(input); });
		process.stdin.on('error', error => { reject(error); });
	});
}

function parseInt(message) {
	return (value) => {
		const int = Number.parseInt(value, 10);

		if (Number.isNaN(int))
		 	throw new commander.InvalidOptionArgumentError(message);

		return int;
	}
}
