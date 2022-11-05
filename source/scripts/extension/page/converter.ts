import * as config from '../config';
import * as filtering from './filtering';
import * as matching from './matching';

function convertRegex(inputText: string, match: config.MatchConfiguration, matchResult: matching.MatchResult, replaceConfiguration: config.ReplaceConfiguration, commonConfiguration: config.CommonConfiguration, site: config.SiteId): string | null {
	try {
		console.debug('I: ', match.replace.value);

		if (match.replace.regex.size) {
			matchResult.regex.lastIndex = 0; // まじかお前
			const regexArray = matchResult.regex.exec(inputText)!;
			const regexGroups = regexArray.groups!;

			return match.replace.value.replace(
				/\$<(.+?)>/g,
				m => {
					const name = m.substring(2, m.length - 1);
					const nameValue = regexGroups[name];
					if (nameValue) {
						const nameMap = match.replace.regex.get(name);
						if (nameMap) {
							const result = nameMap.get(nameValue);
							if (result) {
								return result;
							}
						}

						return nameValue;
					}

					return m;
				}
			);
		} else {
			// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%E8%A7%A3%E8%AA%AC
			const result = inputText.replace(matchResult.regex, match.replace.value);
			return result;
		}

	} catch (e) {
		console.error('catch --> ' + e);
	}

	return null;
}

function convertText(inputText: string, replaceConfiguration: config.ReplaceConfiguration, commonConfiguration: config.CommonConfiguration, site: config.SiteId): string | null {
	const replaceMode = replaceConfiguration.mode;

	switch (replaceMode) {
		case config.ReplaceMode.Normal:
			return replaceConfiguration.value;

		case config.ReplaceMode.Common:
			if (commonConfiguration && commonConfiguration.text) {
				const text = commonConfiguration.text.get(replaceConfiguration.value);
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

export function convert(source: string, targetConfiguration: config.TargetConfiguration, commonConfiguration: config.CommonConfiguration, site: config.SiteId): string | null {
	const inputText = filtering.filter(source, targetConfiguration.filter, site);

	for (const match of targetConfiguration.matches) {

		const matchResult = matching.match(inputText, match, site);
		if (!matchResult.matched) {
			continue;
		}

		if (matchResult.isRegex) {
			const result = convertRegex(inputText, match, matchResult, match.replace, commonConfiguration, site);
			if (result) {
				return result;
			}
		} else {
			const result = convertText(inputText, match.replace, commonConfiguration, site);
			if (result) {
				return result;
			}
		}
	}

	if (targetConfiguration.replace) {
		const result = convertText(inputText, targetConfiguration.replace, commonConfiguration, site);
		if (result) {
			return result;
		}
	}

	return null;
}
