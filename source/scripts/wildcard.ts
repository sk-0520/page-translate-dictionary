import * as common from './common';

export default class Wildcard {
	//#region variable

	private _regex: RegExp;

	//#endregion

	public constructor(pattern: string) {
		const regexPattern = common.escapeRegex(pattern)
			.replaceAll("\\?", '.')
			.replaceAll("\\*", '.*')
		;

		this._regex = new RegExp('^' + regexPattern + '$');
	}

	//#region function

	public static test(input: string, pattern: string): boolean {
		const wildcard = new Wildcard(pattern);
		return wildcard.match(input);
	}

	public match(input: string): boolean {
		return this._regex.test(input);
	}

	//#endregion
}
