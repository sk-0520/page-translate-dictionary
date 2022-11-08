import * as regex from './regex';

export function isNullOrWhiteSpace(s?: string | null): boolean {
	if (!s) {
		return true;
	}
	return s.trim().length === 0;
}

export function replaceAllImpl(source: string, searchValue: string | RegExp, replaceValue: string): string {
	if (searchValue instanceof RegExp) {
		const flags = searchValue.flags.includes('g')
			? searchValue.flags
			: searchValue.flags + 'g'
			;
		return source.replace(new RegExp(searchValue.source, flags), replaceValue);
	}

	return source.replace(new RegExp(regex.escape(searchValue), 'g'), replaceValue);
}

export function replaceAll(source: string, searchValue: string | RegExp, replaceValue: string): string {
	if (!String.prototype.replaceAll) {
		return replaceAllImpl(source, searchValue, replaceValue);
	}

	return source.replaceAll(searchValue, replaceValue);
}
