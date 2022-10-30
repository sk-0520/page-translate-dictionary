import * as config from '../config';
import * as filtering from './filtering';
import * as matching from './matching';

function replaceRegex(inputText: string, match: config.IMatchConfiguration, matchResult: matching.MatchResult, replaceConfiguration: config.IReplaceConfiguration, commonConfiguration: config.ICommonConfiguration, site: config.ISite): string | null {
	try {
		console.debug('I: ', match.replace.value);

		// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%E8%A7%A3%E8%AA%AC
		const result = inputText.replace(matchResult.regex, match.replace.value);

		return result;

	} catch (e) {
		console.error('catch --> ' + e);
	}

	return null;
}

function replaceText(inputText: string, replaceConfiguration: config.IReplaceConfiguration, commonConfiguration: config.ICommonConfiguration, site: config.ISite): string | null {
	const replaceMode = replaceConfiguration.mode;

	switch (replaceMode) {
		case config.ReplaceMode.Normal:
			return replaceConfiguration.value;

		case config.ReplaceMode.Common:
			if (commonConfiguration && commonConfiguration.text) {
				const text = commonConfiguration.text[replaceConfiguration.value];
				if (text) {
					return text;
				} else {
					console.warn(`common.text.${replaceConfiguration.value} is null`);
				}
			} else {
				console.warn('common[.text] is null');
			}
			return null;

		default:
			throw new Error('not impl: ReplaceMode -> ' + replaceMode);
	}
}

export function replace(source: string, targetConfiguration: config.ITargetConfiguration, commonConfiguration: config.ICommonConfiguration, site: config.ISite): string | null {
	const inputText = filtering.filter(source, targetConfiguration.filter, site);
	console.debug(inputText);

	for (const match of targetConfiguration.matches) {
		const matchResult = matching.match(inputText, match, site);
		if (!matchResult.matched) {
			continue;
		}

		if (matchResult.isRegex) {
			const result = replaceRegex(inputText, match, matchResult, match.replace, commonConfiguration, site);
			if (result) {
				return result;
			}
		} else {
			const result = replaceText(inputText, match.replace, commonConfiguration, site);
			if (result) {
				return result;
			}
		}
	}

	if (targetConfiguration.replace) {
		const result = replaceText(inputText, targetConfiguration.replace, commonConfiguration, site);
		if (result) {
			return result;
		}
	}

	return null;
}
