import * as filtering from '../../../scripts/extension/page/filtering';
import * as config from '../../../scripts/extension/config';

describe('filtering', () => {
	test.each([
		[' a', ' a', { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
		['a ', 'a ', { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
		[' a ', ' a ', { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
		['a', ' a', { trim: true, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
		['a', 'a ', { trim: true, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
		['a', ' a ', { trim: true, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
	])('filter-trim', (expected, input: string, filterConfiguration: config.FilterConfiguration) => {
		const siteId: config.SiteId = {
			id: 'test',
			name: 'test',
		};
		expect(filtering.filter(input, filterConfiguration, siteId)).toBe(expected);
	});
});
