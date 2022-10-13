import * as config from '../config';
import * as logging from '../logging';
import * as type from '../type';

const logger = logging.create('translator');

const baseName = 'ptd';
const baseAttr = 'data-' + baseName + '-';

const ClassNames = {
	mark: baseName + '-marked',
}

const Attributes = {
	translated: baseAttr + 'translated',
	text: baseAttr + 'translated-text',
	value: baseAttr + 'translated-value',
	attributeHead: baseAttr + 'translated-attr-',
}

class MatchResult {
	//#region variable

	private _matched: boolean;
	private _regex: RegExpExecArray | null;

	//#endregion

	private constructor(matched: boolean, regex: RegExpExecArray | null) {
		this._matched = matched;
		this._regex = regex;
	}

	//#region property

	public get matched(): boolean {
		return this._matched;
	}

	public get hasRegex(): boolean {
		return this._regex !== null;
	}

	public get regex(): RegExpExecArray {
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

	public static matchedRegex(regex: RegExpExecArray): MatchResult {
		return new MatchResult(true, regex);
	}

	//#endregion
}

//ITargetConfiguration
function filterText(input: string, filterConfiguration: config.IFilterConfiguration): string {
	return input;
}

function matchText(input: string, matchConfiguration: config.IMatchConfiguration): MatchResult {
	const mode = matchConfiguration.mode ?? config.MatchMode.Partial;
	const ignoreCase = matchConfiguration.ignoreCase ?? true;

	switch (mode) {
		case config.MatchMode.Partial:
			let index = -1;
			if (ignoreCase) {
				index = input.toLowerCase().indexOf(matchConfiguration.pattern.toLowerCase());
			} else {
				index = input.indexOf(matchConfiguration.pattern);
			}
			if (index !== -1) {
				return MatchResult.matchedPlain();
			}
			return MatchResult.none();

		case config.MatchMode.Regex:
			const flags = ignoreCase ? 'mi' : 'm';
			try {
				const regex = new RegExp(matchConfiguration.pattern, flags);
				const reg = regex.exec(input);
				if (reg) {
					return MatchResult.matchedRegex(reg);
				}
			} catch (ex) {
				logger.warn(ex);
			}
			return MatchResult.none();

		case config.MatchMode.Forward:
		case config.MatchMode.Backward:
		default:
			return MatchResult.none();
	}
}

function replace(source: string, targetConfiguration: config.ITargetConfiguration, siteConfiguration: config.ISiteConfiguration): string | null {
	let inputText = source;
	if (targetConfiguration.filter && targetConfiguration.match) {
		inputText = filterText(source, targetConfiguration.filter);
	}

	const replaceMode = targetConfiguration.replace.mode ?? config.ReplaceMode.Normal;

	if (targetConfiguration.match) {
		const matchResult = matchText(inputText, targetConfiguration.match);
		if (!matchResult.matched) {
			return null;
		}
		if (matchResult.hasRegex) {
			try {
				console.debug('P: ', matchResult.regex);
				console.debug('I: ', targetConfiguration.replace.value);

				const result = targetConfiguration.replace.value.replace(/\$\{(?<NAME>.+?)\}/g, (s, c) => {
					alert('? ' + s + ': ' + c + ": " + matchResult.regex.groups![c]);
					if(isNaN(parseInt(c))) {
						return matchResult.regex[c];
					} else if(matchResult.regex.groups) {
						return matchResult.regex.groups['NAME'];
					}
					return c;
				});

				alert('R: ' + result);

				return result;

			} catch (e) {
				alert('catch --> ' + e);
			}
		}
	}

	switch (replaceMode) {
		case config.ReplaceMode.Normal:
			return targetConfiguration.replace.value;

		case config.ReplaceMode.Common:
			if (siteConfiguration.common && siteConfiguration.common.text) {
				const text = siteConfiguration.common.text[targetConfiguration.replace.value];
				if (text) {
					return text;
				} else {
					logger.warn(`common.text.${targetConfiguration.replace.value} is null`);
				}
			} else {
				logger.warn('common[.text] is null');
			}
			return null;

		default:
			throw new Error('not impl: ReplaceMode');
	}
}

function translateElement(element: Element, queryConfiguration: config.IQueryConfiguration, siteConfiguration: config.ISiteConfiguration): boolean {
	let translated = false;

	if (queryConfiguration.attributes) {
		for (const [name, targetConfiguration] of Object.entries(queryConfiguration.attributes)) {
			const sourceValue = element.getAttribute(name);
			if (sourceValue) {
				const output = replace(sourceValue, targetConfiguration, siteConfiguration);
				if (output) {
					element.setAttribute(name, output);
					element.setAttribute(Attributes.attributeHead + name, sourceValue);
					translated = true;
				}
			}
		}
	}

	if (type.isInputElement(element) && queryConfiguration.value) {
		const sourceValue = element.value;
		const output = replace(sourceValue, queryConfiguration.value, siteConfiguration);
		if (output) {
			element.value = output;
			element.setAttribute(Attributes.value, sourceValue);
			translated = true;
		}
	} else if (element.textContent && queryConfiguration.text) {
		const sourceValue = element.textContent;
		const output = replace(sourceValue, queryConfiguration.text, siteConfiguration);
		if (output) {
			element.textContent = output;
			element.setAttribute(Attributes.text, sourceValue);
			translated = true;
		}
	}

	if (translated) {
		element.setAttribute(Attributes.translated, '');
	}

	return translated;
}

export function translate(pathConfiguration: config.IPathConfiguration, siteConfiguration: config.ISiteConfiguration, translateConfiguration: config.ITranslateConfiguration): void {
	for (const [selector, queryConfiguration] of Object.entries(pathConfiguration.selector)) {
		logger.debug('selector:', selector)
		const element = document.querySelector(selector);
		if (!element) {
			logger.debug('selector not match:', selector)
			continue;
		}

		logger.debug(queryConfiguration);

		if (translateElement(element, queryConfiguration, siteConfiguration)) {
			if(translateConfiguration.markReplacedElement) {
				element.classList.add(ClassNames.mark);
			}
		}
	}
}
