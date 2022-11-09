import * as types from './types';
import * as regex from './regex';

/**
 * 空文字列か。
 * @param s
 * @returns
 */
export function isEmpty(s: string | null | undefined): s is string {
	return !s && types.isString(s) && s.length === 0;
}

/**
 * null かホワイトスペースで構成された文字列か。
 * @param s
 * @returns
 */
export function isNullOrWhiteSpace(s: string | null | undefined): boolean {
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

export const enum MatchMode {
	Partial,
	Forward,
	Backward,
	Perfect,
	Regex,
}

export interface MatchResult {
	//#region property

	readonly matched: boolean;
	readonly isRegex: boolean;
	readonly regex: RegExp;

	//#endregion

	//#region function
	//#endregion
}

class MatchResultImpl {
	//#region variable

	private _matched: boolean;
	private _regex: RegExp | null;

	//#endregion

	private constructor(matched: boolean, regex: RegExp | null) {
		this._matched = matched;
		this._regex = regex;
	}

	//#region MatchResult

	public get matched(): boolean {
		return this._matched;
	}

	public get isRegex(): boolean {
		return this._regex !== null;
	}

	public get regex(): RegExp {
		if (!this._regex) {
			throw new Error('regex');
		}

		return this._regex;
	}

	//#endregion


	//#region function

	public static none(): MatchResult {
		return new MatchResultImpl(false, null);
	}

	public static matchedPlain(): MatchResult {
		return new MatchResultImpl(true, null);
	}

	public static matchedRegex(regex: RegExp): MatchResult {
		return new MatchResultImpl(true, regex);
	}

	//#endregion
}

export function match(input: string, pattern: string, ignoreCase: boolean, mode: MatchMode): MatchResult {
	switch (mode) {
		case MatchMode.Partial:
			let index = -1;
			if (ignoreCase) {
				index = input.toLowerCase().indexOf(pattern.toLowerCase());
			} else {
				index = input.indexOf(pattern);
			}
			if (index !== -1) {
				return MatchResultImpl.matchedPlain();
			}
			return MatchResultImpl.none();

		case MatchMode.Forward:
			if (ignoreCase) {
				if (input.toLowerCase().startsWith(pattern.toLowerCase())) {
					return MatchResultImpl.matchedPlain();
				}
			} else {
				if (input.startsWith(pattern)) {
					return MatchResultImpl.matchedPlain();
				}
			}
			return MatchResultImpl.none();

		case MatchMode.Backward:
			if (ignoreCase) {
				if (input.toLowerCase().endsWith(pattern.toLowerCase())) {
					return MatchResultImpl.matchedPlain();
				}
			} else {
				if (input.endsWith(pattern)) {
					return MatchResultImpl.matchedPlain();
				}
			}
			return MatchResultImpl.none();

		case MatchMode.Perfect:
			if (ignoreCase) {
				if (input.toLowerCase() === pattern.toLowerCase()) {
					return MatchResultImpl.matchedPlain();
				}
			} else {
				if (input === pattern) {
					return MatchResultImpl.matchedPlain();
				}
			}
			return MatchResultImpl.none();

		case MatchMode.Regex:
			const flags = ignoreCase ? 'gi' : 'g';
			try {
				const regex = new RegExp(pattern, flags);
				if (regex.test(input)) {
					return MatchResultImpl.matchedRegex(regex);
				}
			} catch (ex) {
				console.warn('match:RegExp', ex);
			}

			return MatchResultImpl.none();

		default:
			return MatchResultImpl.none();
	}
}
