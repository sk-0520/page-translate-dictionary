/**
 * @jest-environment jsdom
 */
import * as dom from '../../scripts/core/dom';

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

	test('requireClosest', () => {
		document.body.innerHTML = `
			<div id="a">
				<div id="b">
					<div id="c">
						<div id="d">
						</div>
					</div>
				</div>
			</div>
		`;

		const a = document.getElementById('a') as HTMLElement;
		const b = document.getElementById('b') as HTMLElement;
		const c = document.getElementById('c') as HTMLElement;
		const d = document.getElementById('d') as HTMLElement;

		expect(dom.requireClosest('*', a).id).toBe('a');
		expect(dom.requireClosest('#a', b).id).toBe('a');
		expect(dom.requireClosest('#b', c).id).toBe('b');
		expect(dom.requireClosest('#b', d).id).toBe('b');
		expect(dom.requireClosest('#a > div', d).id).toBe('b');
		expect(dom.requireClosest('#a > div > div', d).id).toBe('c');

		expect(() => dom.requireClosest('#a span', d)).toThrowError(Error);
	});

	test('getParentForm', () => {
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

	test('cloneTemplate', () => {
		document.body.innerHTML = `
			<template id="a">
				<div name="a"></div>
			</template>
			<div id="error">xxx</div>
		`;

		const a1 = document.getElementById('a') as HTMLTemplateElement;
		const a2 = dom.cloneTemplate<HTMLElement>(a1);
		expect(a2.querySelector('[name]')?.getAttribute('name')).toBe('a');

		const b2 = dom.cloneTemplate<HTMLElement>('#a');
		expect(b2.querySelector('[name]')?.getAttribute('name')).toBe('a');

		expect(() => dom.cloneTemplate('#error')).toThrowError(Error);
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
