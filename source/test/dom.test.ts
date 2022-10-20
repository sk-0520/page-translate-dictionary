/**
 * @jest-environment jsdom
 */
import * as dom from '../scripts/dom';

describe('dom', () => {
	test('requireElementById', () => {
		document.body.innerHTML = `
			<span id="id1">id1:1</span>
			<span id="id2">id2:1</span>
		`;

		expect(dom.requireElementById('id1').textContent!).toBe('id1:1');
		expect(dom.requireElementById('id2').textContent!).toBe('id2:1');

		expect(() => dom.requireElementById('id3')).toThrowError(Error);
	});

	test('toCustomKey', () => {
		expect(dom.toCustomKey('')).toBe('');
		expect(dom.toCustomKey('a')).toBe('a');
		expect(dom.toCustomKey('aB')).toBe('ab');
		expect(dom.toCustomKey('aBc')).toBe('abc');
		expect(dom.toCustomKey('a-b')).toBe('aB');
		expect(dom.toCustomKey('a-b-c')).toBe('aBC');

		expect(dom.toCustomKey('dataset-key-data')).toBe('datasetKeyData');

		expect(dom.toCustomKey('data-key-data')).toBe('keyData');
		expect(dom.toCustomKey('data-key-data', true)).toBe('keyData');
		expect(dom.toCustomKey('data-key-data', false)).toBe('dataKeyData');
	})
});
