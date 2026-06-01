const DATE_STYLES = ['full', 'long', 'medium', 'short'];
const NUMERIC_STYLES = ['numeric', '2-digit'];
const TEXT_STYLES = ['long', 'short', 'narrow'];
const MONTH_STYLES = NUMERIC_STYLES.concat(TEXT_STYLES);
const DAY_STYLES = NUMERIC_STYLES.concat(TEXT_STYLES);

const DATE_STYLE_ALIASES = {
	default:'medium',
	med:'medium',
};

const PART_STYLE_ALIASES = {
	'2':'2-digit',
	'2digit':'2-digit',
	'two-digit':'2-digit',
	digit:'2-digit',
	digits:'2-digit',
	num:'numeric',
	number:'numeric',
	text:'long',
	name:'long',
	full:'long',
	abbr:'short',
	abbrev:'short',
	abbreviated:'short',
};

function datenow(dateStyle = 'medium', timeStyle = 'medium', locale = undefined, timeZone = undefined, value = undefined) {
	return datetime(dateStyle, timeStyle, locale, timeZone, value);
}

datenow.now = datenow;
datenow.date = date;
datenow.time = time;
datenow.datetime = datetime;
datenow.full = (locale, timeZone, value) => date('full', locale, timeZone, value);
datenow.long = (locale, timeZone, value) => date('long', locale, timeZone, value);
datenow.medium = (locale, timeZone, value) => date('medium', locale, timeZone, value);
datenow.short = (locale, timeZone, value) => date('short', locale, timeZone, value);
datenow.iso = iso;
datenow.stamp = () => { return [ datenow.month(2), datenow.day(2), datenow.year(), datenow.hour24(), datenow.minute(), datenow.second() ].join(''); };
datenow.timestamp = timestamp;
datenow.unix = unix;
datenow.year = year;
datenow.month = month;
datenow.day = day;
datenow.weekday = weekday;
datenow.dayname = weekday;
datenow.hour = hour;
datenow.hour12 = hour12;
datenow['hour-12'] = hour12;
datenow.hour24 = hour24;
datenow['hour-24'] = hour24;
datenow['24h'] = hour24;
datenow.minute = minute;
datenow.second = second;
datenow.ampm = ampm;
datenow['am-pm'] = ampm;
datenow.period = ampm;
datenow.dayperiod = ampm;
datenow['day-period'] = ampm;

module.exports = datenow;

function date(style = 'medium', locale = undefined, timeZone = undefined, value = undefined) {
	return format({ dateStyle: normalizeDateStyle(style, 'medium') }, locale, timeZone, value);
}

function time(style = 'medium', locale = undefined, timeZone = undefined, value = undefined) {
	return format({ timeStyle: normalizeDateStyle(style, 'medium') }, locale, timeZone, value);
}

function datetime(dateStyle = 'medium', timeStyle = 'medium', locale = undefined, timeZone = undefined, value = undefined) {
	return format({
		dateStyle: normalizeDateStyle(dateStyle, 'medium'),
		timeStyle: normalizeDateStyle(timeStyle, 'medium'),
	}, locale, timeZone, value);
}

function iso(value = undefined) {
	return toDate(value).toISOString();
}

function timestamp(value = undefined) {
	return toDate(value).getTime().toString();
}

function unix(value = undefined) {
	return Math.floor(toDate(value).getTime() / 1000).toString();
}

function year(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('year', style, locale, timeZone, value, NUMERIC_STYLES, 'numeric');
}

function month(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('month', style, locale, timeZone, value, MONTH_STYLES, 'numeric');
}

function day(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	const normalized = normalizePartStyle(style, DAY_STYLES, 'numeric');

	if (TEXT_STYLES.includes(normalized))
		return weekday(normalized, locale, timeZone, value);

	return getPart('day', { day:normalized }, locale, timeZone, value);
}

function weekday(style = 'long', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('weekday', style, locale, timeZone, value, TEXT_STYLES, 'long');
}

function hour(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('hour', style, locale, timeZone, value, NUMERIC_STYLES, 'numeric');
}

function hour12(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('hour', style, locale, timeZone, value, NUMERIC_STYLES, 'numeric', { hour12:true });
}

function hour24(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('hour', style, locale, timeZone, value, NUMERIC_STYLES, 'numeric', { hourCycle:'h23' });
}

function minute(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('minute', style, locale, timeZone, value, NUMERIC_STYLES, 'numeric');
}

function second(style = 'numeric', locale = undefined, timeZone = undefined, value = undefined) {
	return formatPart('second', style, locale, timeZone, value, NUMERIC_STYLES, 'numeric');
}

function ampm(locale = undefined, timeZone = undefined, value = undefined) {
	return getPart('dayPeriod', { hour:'numeric', hour12:true }, locale, timeZone, value);
}

function formatPart(part, style, locale, timeZone, value, allowed, fallback, extra = {}) {
	const options = Object.assign({ [part]:normalizePartStyle(style, allowed, fallback) }, extra);

	return getPart(part, options, locale, timeZone, value);
}

function getPart(part, options, locale, timeZone, value) {
	const parts = formatter(locale, withTimeZone(options, timeZone)).formatToParts(toDate(value));
	const match = parts.find(item => item.type === part);

	return match ? match.value : '';
}

function format(options, locale, timeZone, value) {
	return formatter(locale, withTimeZone(options, timeZone)).format(toDate(value));
}

function formatter(locale, options) {
	try {
		return new Intl.DateTimeFormat(optional(locale), options);
	} catch (error) {
		const fallbackOptions = Object.assign({}, options);
		delete fallbackOptions.timeZone;

		return new Intl.DateTimeFormat(undefined, fallbackOptions);
	}
}

function withTimeZone(options, timeZone) {
	const zone = optional(timeZone);

	if (!zone) return options;

	return Object.assign({}, options, { timeZone:zone });
}

function normalizeDateStyle(style, fallback) {
	return normalizeStyle(style, DATE_STYLES, fallback, DATE_STYLE_ALIASES);
}

function normalizePartStyle(style, allowed, fallback) {
	return normalizeStyle(style, allowed, fallback, PART_STYLE_ALIASES);
}

function normalizeStyle(style, allowed, fallback, aliases) {
	const value = optional(style, fallback);
	const key = typeof value === 'string' ? value.toLowerCase() : value;
	const normalized = aliases[key] || key;

	return allowed.includes(normalized) ? normalized : fallback;
}

function optional(value, fallback = undefined) {
	if (value === undefined || value === null) return fallback;
	if (typeof value !== 'string') return value;

	const trimmed = value.trim();

	return trimmed ? trimmed : fallback;
}

function toDate(value = undefined) {
	value = optional(value);

	if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
	if (typeof value === 'number') return new Date(value);

	if (value) {
		const parsed = new Date(value);

		if (!Number.isNaN(parsed.getTime())) return parsed;
	}

	return new Date();
}
