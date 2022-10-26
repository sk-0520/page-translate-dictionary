import * as config from '../config';
import * as logging from '../../core/logging';
import * as filtering from './filtering';
import * as matching from './matching';

const logger = logging.create('replacer');

export function replace(source: string, targetConfiguration: config.ITargetConfiguration, siteConfiguration: config.ISiteConfiguration): string | null {
	const inputText = filtering.filterText(source, targetConfiguration.filter);

	const replaceMode = targetConfiguration.replace.mode;

	if (targetConfiguration.match) {
		const matchResult = matching.matchText(inputText, targetConfiguration.match);
		if (!matchResult.matched) {
			return null;
		}

		if (matchResult.isRegex) {
			try {
				logger.debug('I: ', targetConfiguration.replace.value);

				// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%E8%A7%A3%E8%AA%AC
				const result = inputText.replace(matchResult.regex, targetConfiguration.replace.value);

				return result;

			} catch (e) {
				logger.error('catch --> ' + e);
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
			throw new Error('not impl: ReplaceMode -> ' + replaceMode);
	}
}
