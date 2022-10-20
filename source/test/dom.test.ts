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

	test('requireSelector', () => {
		document.body.innerHTML = `
			<div>
				<div data-name="x">X1</div>
				<div name="x">X2</div>
			</div>
		`;

		expect(dom.requireSelector('[data-name="x"]').textContent!).toBe('X1');
		expect(dom.requireSelector('[name="x"]').textContent!).toBe('X2');

		expect(() => dom.requireSelector('.x')).toThrowError(Error);
	});

	test('requireSelector', () => {
		document.body.innerHTML = `
			<form data-key="a">
				<div id="a"></div>
			</form>
			<form data-key="b">
				<div id="b"></div>
			</form>
			<div>
				<div id="c"></div>
			</div>
		`;

		const a = document.getElementById('a') as HTMLElement;
		const b = document.getElementById('b') as HTMLElement;
		const c = document.getElementById('c') as HTMLElement;

		expect(dom.getParentForm(a).dataset['key']!).toBe('a');
		expect(dom.getParentForm(b).dataset['key']!).toBe('b');

		expect(() => dom.getParentForm(c)).toThrowError(Error);
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
