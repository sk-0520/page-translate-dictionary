import * as throws from '../../core/throws';
import * as config from '../config';

function filterLineBreak(input: string, lineBreak: config.LineBreak): string {

	switch (lineBreak) {
		case config.LineBreak.Join: {
			return input.replace(/[\r\n|\n|\r]+/g, ' ');
		}

		case config.LineBreak.Raw: {
			return input;
		}

		default:
			throw new throws.NotImplementedError();
	}
}

function filterWhiteSpace(input: string, whiteSpace: config.WhiteSpace): string {

	switch (whiteSpace) {
		case config.WhiteSpace.Join: {
			return input.replace(/[ \t]+/g, ' ');
		}

		case config.WhiteSpace.Raw: {
			return input;
		}

		default:
			throw new throws.NotImplementedError();
	}

}


function filterTrim(input: string, isTrim: boolean): string {
	if (isTrim) {
		return input.trim();
	}

	return input;
}

export function filter(input: string, filterConfiguration: config.FilterConfiguration, siteId: config.SiteId): string {

	const filteredLineBreak = filterLineBreak(input, filterConfiguration.lineBreak);
	const filteredWhiteSpace = filterWhiteSpace(filteredLineBreak, filterConfiguration.whiteSpace);
	const result = filterTrim(filteredWhiteSpace, filterConfiguration.trim);

	return result;
}
