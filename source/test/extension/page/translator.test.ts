/**
 * @jest-environment jsdom
 */
import * as translator from '../../../scripts/extension/page/translator';
import * as config from '../../../scripts/extension/config';

//, siteConfiguration: config.SiteConfiguration, metaMap: ReadonlyMap<string, string>, translateConfiguration: Readonly<config.TranslateConfiguration>

describe('translator', () => {
	test('translateElement', () => {
		document.body.innerHTML = `
			<p id="id">a</p>
		`;

		const idElement = document.getElementById('id')!;

		const path: config.PathConfiguration = {
			withSearch: false,
			query: [
				{
					selector: {
						mode: config.SelectorMode.Normal,
						value: "#id",
						all: false,
						meta: new Map(),
						node: 0,
					},
					text: {
						filter: {
							lineBreak: config.LineBreak.Join,
							whiteSpace: config.WhiteSpace.Join,
							trim: true,
						},
						matches: [],
						replace: {
							mode: config.ReplaceMode.Normal,
							value: 'A',
							regex: new Map(),
						}
					},
					attributes: new Map(),
				}
			],
			import: [],
		};

		expect(idElement.textContent).toBe('a');
		const actual = translator.translateElement(idElement, path.query[0], { query: new Map(), selector: new Map(), text: new Map() }, { id: config.toInternalId('id'), name: 'name' });
		expect(actual).toBeTruthy();
		expect(idElement.textContent).toBe('A');

	});
});
