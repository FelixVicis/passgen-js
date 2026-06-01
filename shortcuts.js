const shortcuts = [
	{
		name:'hex',
		aliases:['h'],
		description:'Lowercase hexadecimal',
		format:({ length }) => call('lang.lhex', length),
	},
	{
		name:'HEX',
		aliases:['H'],
		description:'Uppercase hexadecimal',
		format:({ length }) => call('lang.hex', length),
	},
	{
		name:'lower',
		aliases:['alphanumeric', 'alpha', 'clean', 'a', 'll', 'l'],
		description:'Lowercase letters and numbers without look-alikes',
		format:({ length }) => call('lang.lower', length),
	},
	{
		name:'insensitive',
		aliases:['insen', 'i'],
		description:'All letters and numbers without look-alikes',
		format:({ length }) => call('lang.insensitive', length),
	},
	{
		name:'base36',
		aliases:['36'],
		description:'All letters and numbers with look-alikes',
		format:({ length }) => call('lang.alphanumeric', length),
	},
	{
		name:'digits',
		aliases:['d'],
		description:'Just numbers',
		format:({ length }) => call('lang.numeric', length),
	},
	{
		name:'upper',
		description:'Uppercase letters and numbers without look-alikes',
		format:({ length }) => call('lang.clean', length),
	},
	{
		name:'unicode',
		aliases:['uni'],
		description:'Unicode characters',
		format:({ length }) => call('lang.unicode', length),
	},
	{
		name:'symbols',
		aliases:['sym'],
		description:'Letters, numbers, and symbols',
		format:({ length }) => call('lang.symbols', length),
	},
	{
		name:'uuid',
		aliases:['uuidv4', 'u'],
		description:'UUID v4',
		format:() => call('uuid'),
		prefix:'',
		postfix:'',
	},
	{
		name:'sha',
		aliases:['sha256'],
		description:'Randomly generated sha256 value',
		format:() => call('rsha'),
	},
	{
		name:'name',
		aliases:['n'],
		description:'Full name',
		format:() => call('name'),
	},
	{
		name:'firstname',
		aliases:['first', 'fn'],
		description:'First name',
		format:() => call('name.first'),
	},
	{
		name:'lastname',
		aliases:['last', 'surname', 'ln'],
		description:'Last name',
		format:() => call('name.last'),
	},
	{
		name:'lorem',
		description:'Lorem ipsum sentence',
		format:({ length }) => call('lorem.sentance', length),
	},
	{
		name:'datestamp',
		aliases:['stamp'],
		description:'Compact date and time stamp',
		format:() => [
			call('date.month', 2),
			call('date.day', 2),
			call('date.year'),
			call('date.hour24'),
			call('date.minute'),
			call('date.second'),
		].join(''),
	},
	{
		name:'custom',
		description:'Custom language from --language',
		format:({ length, language }) => call('lang.custom', length, language),
	},
];

const shortcutMap = buildShortcutMap(shortcuts);

module.exports = {
	all:shortcuts,
	get:getShortcutConfig,
	format:getShortcutFormat,
	has:type => shortcutMap.has(type),
	help:shortcutHelp,
};

function getShortcutConfig(type, options = {}) {
	if (!shortcutMap.has(type)) return null;

	const shortcut = shortcutMap.get(type);
	const format = getShortcutFormat(type, options);

	return {
		name:shortcut.name,
		type,
		description:shortcut.description,
		format,
		prefix:shortcut.prefix,
		postfix:shortcut.postfix,
	};
}

function getShortcutFormat(type, options = {}) {
	if (!shortcutMap.has(type)) return null;

	const shortcut = shortcutMap.get(type);

	if (typeof shortcut.format === 'function')
		return shortcut.format(options);

	return shortcut.format;
}

function shortcutHelp() {
	const list = shortcuts
		.map(shortcut => {
			const names = [shortcut.name].concat(shortcut.aliases || []).join(', ');

			return `   - ${names}, ${shortcut.description}`;
		})
		.join('\n');

	return `\n\nShortcut Generators:\nThese are convenience aliases over format strings.\n${list}`;
}

function buildShortcutMap(shortcuts) {
	const map = new Map();

	shortcuts.forEach(shortcut => {
		map.set(shortcut.name, shortcut);

		(shortcut.aliases || []).forEach(alias => map.set(alias, shortcut));
	});

	return map;
}

function call(name, ...params) {
	return `${name}(${params.map(formatParam).join(',')})`;
}

function formatParam(param) {
	if (param === undefined || param === null) return '';

	return `${param}`;
}
