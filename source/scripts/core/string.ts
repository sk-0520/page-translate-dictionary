import * as regex from './regex';

export function isNullOrEmpty(s?: string | null): boolean {
	if (!s) {
		return true;
	}
	return s.length === 0;
}

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

/**
 * 数値埋め処理。
 *
 * @param input 数値。
 * @param width 幅数。
 * @param c 埋め文字。
 * @returns
 */
export function padding(input: number, width: number, c: string): string {
	if (input < 0) {
		throw new Error('input is negative');
	}
	if (c.length != 1) {
		throw new Error('c.length is ' + c.length);
	}

	const numberValue = input.toString();

	// 埋める余地がない場合はそのまま返す
	if (width <= numberValue.length) {
		return numberValue;
	}
	const count = width - numberValue.length;
	const result = c.repeat(count) + numberValue;
	return result;
}
