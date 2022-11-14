/**
 * @jest-environment jsdom
 */
import * as dom from '../../scripts/core/dom';
import * as throws from '../../scripts/core/throws';

describe('dom', () => {
	test('requireElementById', () => {
		document.body.innerHTML = `
			<span id="id1">id1:1</span>
			<span id="id2">id2:1</span>
		`;

		expect(dom.requireElementById('id1').textContent!).toBe('id1:1');
		expect(dom.requireElementById('id2').textContent!).toBe('id2:1');
		expect(dom.requireElementById('id2', HTMLSpanElement).textContent!).toBe('id2:1');

		expect(() => dom.requireElementById('id3')).toThrowError(throws.NotFoundDomSelectorError);
		expect(() => dom.requireElementById('id2', HTMLDivElement)).toThrowError(throws.ElementTypeError);
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

		expect(() => dom.requireSelector('.x')).toThrowError(throws.NotFoundDomSelectorError);
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

		expect(dom.requireClosest(a, '*').id).toBe('a');
		expect(dom.requireClosest(b, '#a').id).toBe('a');
		expect(dom.requireClosest(c, '#b').id).toBe('b');
		expect(dom.requireClosest(d, '#b').id).toBe('b');
		expect(dom.requireClosest(d, '#a > div').id).toBe('b');
		expect(dom.requireClosest(d, '#a > div > div').id).toBe('c');

		expect(() => dom.requireClosest(d, '#a span')).toThrowError(throws.NotFoundDomSelectorError);
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
		const a2 = dom.cloneTemplate(a1);
		expect(a2.querySelector('[name]')?.getAttribute('name')).toBe('a');

		const b2 = dom.cloneTemplate('#a');
		expect(b2.querySelector('[name]')?.getAttribute('name')).toBe('a');

		expect(() => dom.cloneTemplate('#error')).toThrowError(throws.ElementTypeError);
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
	});

	test('attach:Last', () => {
		document.body.innerHTML = `
			<div id="root">
				<div id="A">A</div>
				<div id="B">B</div>
				<div id="C">C</div>
			</div>
		`;
		const root = document.getElementById('root')!;

		const div = document.createElement('div');
		div.textContent = '*';

		dom.attach(root, dom.DomPosition.Last, div);
		expect(root.children[0].textContent).toBe('A');
		expect(root.children[1].textContent).toBe('B');
		expect(root.children[2].textContent).toBe('C');
		expect(root.children[3].textContent).toBe('*');
	});

	test('attach:First', () => {
		document.body.innerHTML = `
			<div id="root">
				<div id="A">A</div>
				<div id="B">B</div>
				<div id="C">C</div>
			</div>
		`;
		const root = document.getElementById('root')!;

		const div = document.createElement('div');
		div.textContent = '*';

		dom.attach(root, dom.DomPosition.First, div);
		expect(root.children[0].textContent).toBe('*');
		expect(root.children[1].textContent).toBe('A');
		expect(root.children[2].textContent).toBe('B');
		expect(root.children[3].textContent).toBe('C');
	});

	test('attach:Previous', () => {
		document.body.innerHTML = `
			<div id="root">
				<div id="A">A</div>
				<div id="B">B</div>
				<div id="C">C</div>
			</div>
		`;
		const root = document.getElementById('root')!;
		const center = document.getElementById('B')!;

		const div = document.createElement('div');
		div.textContent = '*';

		dom.attach(center, dom.DomPosition.Previous, div);
		expect(root.children[0].textContent).toBe('A');
		expect(root.children[1].textContent).toBe('*');
		expect(root.children[2].textContent).toBe('B');
		expect(root.children[3].textContent).toBe('C');
	});


	test('attach:Next', () => {
		document.body.innerHTML = `
			<div id="root">
				<div id="A">A</div>
				<div id="B">B</div>
				<div id="C">C</div>
			</div>
		`;
		const root = document.getElementById('root')!;
		const center = document.getElementById('B')!;

		const div = document.createElement('div');
		div.textContent = '*';

		dom.attach(center, dom.DomPosition.Next, div);
		expect(root.children[0].textContent).toBe('A');
		expect(root.children[1].textContent).toBe('B');
		expect(root.children[2].textContent).toBe('*');
		expect(root.children[3].textContent).toBe('C');
	});

	test('createFactory', () => {
		document.body.innerHTML = `
			<div id="root"></div>
		`;
		const root = document.getElementById('root')!;

		const p = dom.createFactory('p');
		p.createText('HEAD');
		const span = p.createTag('span');
		span.element.textContent = 'CENTER';
		p.createText('TAIL');

		const pe = dom.attach(root, dom.DomPosition.Last, p);

		expect(pe).toBe(p.element);
		expect(pe.childNodes[0].textContent).toBe('HEAD');
		expect(pe.childNodes[1].textContent).toBe('CENTER');
		expect(pe.childNodes[1].nodeName).toBe('SPAN');
		expect(pe.childNodes[2].textContent).toBe('TAIL');

	});
});
