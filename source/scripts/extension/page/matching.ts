import * as config from '../config';

export class MatchResult {
	//#region variable

	private _matched: boolean;
	private _regex: RegExp | null;

	//#endregion

	private constructor(matched: boolean, regex: RegExp | null) {
		this._matched = matched;
		this._regex = regex;
	}

	//#region property

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
		return new MatchResult(false, null);
	}

	public static matchedPlain(): MatchResult {
		return new MatchResult(true, null);
	}

	public static matchedRegex(regex: RegExp): MatchResult {
		return new MatchResult(true, regex);
	}

	//#endregion
}

export function matchText(input: string, matchConfiguration: config.IMatchConfiguration): MatchResult {
	switch (matchConfiguration.mode) {
		case config.MatchMode.Partial:
			let index = -1;
			if (matchConfiguration.ignoreCase) {
				index = input.toLowerCase().indexOf(matchConfiguration.pattern.toLowerCase());
			} else {
				index = input.indexOf(matchConfiguration.pattern);
			}
			if (index !== -1) {
				return MatchResult.matchedPlain();
			}
			return MatchResult.none();

		case config.MatchMode.Regex:
			const flags = matchConfiguration.ignoreCase ? 'mi' : 'm';
			try {
				const regex = new RegExp(matchConfiguration.pattern, flags);
				if (regex.test(input)) {
					return MatchResult.matchedRegex(regex);
				}
			} catch (ex) {
				console.warn(ex);
			}
			return MatchResult.none();

		case config.MatchMode.Forward:
			if (matchConfiguration.ignoreCase) {
				if (input.toLowerCase().startsWith(matchConfiguration.pattern.toLowerCase())) {
					return MatchResult.matchedPlain();
				}
			} else {
				if (input.startsWith(matchConfiguration.pattern)) {
					return MatchResult.matchedPlain();
				}
			}
			return MatchResult.none();

		case config.MatchMode.Backward:
			if (matchConfiguration.ignoreCase) {
				if (input.toLowerCase().endsWith(matchConfiguration.pattern.toLowerCase())) {
					return MatchResult.matchedPlain();
				}
			} else {
				if (input.endsWith(matchConfiguration.pattern)) {
					return MatchResult.matchedPlain();
				}
			}
			return MatchResult.none();

		case config.MatchMode.Perfect:
			if (matchConfiguration.ignoreCase) {
				if (input.toLowerCase() === matchConfiguration.pattern.toLowerCase()) {
					return MatchResult.matchedPlain();
				}
			} else {
				if (input === matchConfiguration.pattern) {
					return MatchResult.matchedPlain();
				}
			}
			return MatchResult.none();

		default:
			return MatchResult.none();
	}
}
