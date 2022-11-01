import * as filtering from '../../../scripts/extension/page/filtering';
import * as config from '../../../scripts/extension/config';

describe('filtering', () => {
	test.each([
		["a", "a", { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Join }],
		["a a", "a\r\na", { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Join }],
		["a a", "a\r\r\r\r\r\ra", { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Join }],
		["a a", "a\n\n\n\n\n\na", { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Join }],
		["a a", "a\r\n\r\n\r\na", { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Join }],
		["a   a  ", "a\n \na \n", { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Join }],
	])('filter-line-break', (expected, input: string, filterConfiguration: config.FilterConfiguration) => {
		const siteId: config.SiteId = {
			id: 'test',
			name: 'test',
		};
		expect(filtering.filter(input, filterConfiguration, siteId)).toBe(expected);
	});

	test.each([
		["a", "a", { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Raw }],
		["a ", "a   ", { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Raw }],
		[" a", "   a", { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Raw }],
		[" a ", "   a   ", { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Raw }],
		[" a a a ", "   a   a   a   ", { trim: false, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Raw }],
	])('filter-white-space', (expected, input: string, filterConfiguration: config.FilterConfiguration) => {
		const siteId: config.SiteId = {
			id: 'test',
			name: 'test',
		};
		expect(filtering.filter(input, filterConfiguration, siteId)).toBe(expected);
	});

	test.each([
		[' a', ' a', { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Raw }],
		['a ', 'a ', { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Raw }],
		[' a ', ' a ', { trim: false, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Raw }],
		['a', ' a', { trim: true, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Raw }],
		['a', 'a ', { trim: true, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Raw }],
		['a', ' a ', { trim: true, whiteSpace: config.WhiteSpace.Raw, lineBreak: config.LineBreak.Raw }],
	])('filter-trim', (expected, input: string, filterConfiguration: config.FilterConfiguration) => {
		const siteId: config.SiteId = {
			id: 'test',
			name: 'test',
		};
		expect(filtering.filter(input, filterConfiguration, siteId)).toBe(expected);
	});

	test.each([
		["a", "a", { trim: true, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
		["a a b", "a\r\na   \r   \nb   \r\n   \n", { trim: true, whiteSpace: config.WhiteSpace.Join, lineBreak: config.LineBreak.Join }],
	])('filter-join-join-true', (expected, input: string, filterConfiguration: config.FilterConfiguration) => {
		const siteId: config.SiteId = {
			id: 'test',
			name: 'test',
		};
		expect(filtering.filter(input, filterConfiguration, siteId)).toBe(expected);
	});
});
