import * as types from './types';
import * as throws from './throws';

/**
 * ID から要素取得を強制。
 *
 * @param elementId
 * @returns
 */
export function requireElementById<THtmlElement extends HTMLElement>(elementId: string, instance?: { prototype: THtmlElement }): THtmlElement {
	const result = document.getElementById(elementId);
	if (!result) {
		throw new throws.NotFoundDomSelectorError(elementId);
	}

	if (instance) {
		if (result.constructor.name !== instance.prototype.constructor.name) {
			throw new throws.ElementTypeError(`${result.constructor.name} != ${instance.prototype.constructor.name}`);
		}
	}

	return result as THtmlElement;
}

/**
 * セレクタから要素取得を強制。
 *
 * @param element
 * @param selectors
 * @returns
 */
export function requireSelector<K extends keyof HTMLElementTagNameMap>(element: Element, selectors: K): HTMLElementTagNameMap[K];
export function requireSelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
export function requireSelector<K extends keyof SVGElementTagNameMap>(element: Element, selectors: K): SVGElementTagNameMap[K];
export function requireSelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K];
export function requireSelector<TElement extends Element = Element>(selectors: string): TElement;
export function requireSelector<TElement extends Element = Element>(element: Element, selectors: string): TElement;
export function requireSelector(element: Element | string | null, selectors?: string): Element {
	if (types.isString(element)) {
		if (selectors) {
			throw new throws.ArgumentError('selectors');
		}
		selectors = element;
		element = null;
	} else {
		if (types.isUndefined(selectors)) {
			throw new throws.ArgumentError('selectors');
		}
	}

	const result = (element ?? document).querySelector(selectors);
	if (!result) {
		throw new throws.NotFoundDomSelectorError(selectors);
	}

	return result;
}

/**
 * セレクタから先祖要素を取得。
 *
 * @param selectors
 * @param element
 * @returns
 */
export function requireClosest<K extends keyof HTMLElementTagNameMap>(element: Element, selectors: K): HTMLElementTagNameMap[K];
export function requireClosest<K extends keyof SVGElementTagNameMap>(element: Element, selectors: K): SVGElementTagNameMap[K];
export function requireClosest<E extends Element = Element>(element: Element, selectors: string): E;
export function requireClosest(element: Element, selectors: string): Element {
	const result = element.closest(selectors);
	if (!result) {
		throw new throws.NotFoundDomSelectorError(selectors);
	}

	return result;
}

/**
 * 対象要素から所属する `Form` 要素を取得する。
 * @param element `Form` に所属する要素。
 * @returns
 */
export function getParentForm(element: Element): HTMLFormElement {
	const formElement = requireClosest(element, 'form');
	if (formElement === null) {
		throw new throws.NotFoundDomSelectorError(element.outerHTML);
	}

	return formElement;
}

/**
 * テンプレートを実体化。
 * @param selectors
 */
export function cloneTemplate<TElement extends Element>(selectors: string): TElement;
export function cloneTemplate<TElement extends Element>(element: HTMLTemplateElement): TElement;
export function cloneTemplate<TElement extends Element>(input: string | HTMLTemplateElement): TElement {
	if (typeof input === 'string') {
		const element = requireSelector<HTMLTemplateElement>(input);
		if (element.tagName !== 'TEMPLATE') {
			throw new throws.NotFoundDomSelectorError(input + ': ' + element.tagName);
		}
		input = element;
	}

	return input.content.cloneNode(true) as TElement;
}

/**
 * カスタムデータ属性のケバブ名を dataset アクセス可能な名前に変更
 * @param kebab データ属性名。
 * @param removeDataAttributeBegin 先頭の `data-`* を破棄するか。
 */
export function toCustomKey(kebab: string, removeDataAttributeBegin: boolean = true): string {

	const dataHead = 'data-';
	if (removeDataAttributeBegin && kebab.startsWith(dataHead)) {
		kebab = kebab.substring(dataHead.length);
	}

	return kebab
		.split('-')
		.map((item, index) => index
			? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
			: item.toLowerCase()
		)
		.join('')
		;
}

/**
 * データ属性から値を取得。
 *
 * @param element 要素。
 * @param dataKey データ属性名。
 * @param removeDataAttributeBegin 先頭の `data-` を破棄するか。
 * @returns
 */
export function getDataset(element: HTMLOrSVGElement, dataKey: string, removeDataAttributeBegin: boolean = true): string {
	const key = toCustomKey(dataKey, removeDataAttributeBegin);
	const value = element.dataset[key];
	if (types.isUndefined(value)) {
		throw new Error(`${element}.${key}`);
	}

	return value;
}

/**
 * データ属性から値を取得。
 *
 * @param element 要素。
 * @param dataKey データ属性名。
 * @param fallback 取得失敗時の返却値。
 * @param removeDataAttributeBegin 先頭の `data-`* を破棄するか。
 * @returns
 */
export function getDatasetOr(element: HTMLOrSVGElement, dataKey: string, fallback: string, removeDataAttributeBegin: boolean = true): string {
	const key = toCustomKey(dataKey, removeDataAttributeBegin);
	const value = element.dataset[key];
	if (types.isUndefined(value)) {
		return fallback;
	}

	return value;
}


/** @deprecated */
export function createFactory<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, options?: ElementCreationOptions): TagFactory<HTMLElementDeprecatedTagNameMap[K]>;
export function createFactory<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): TagFactory<HTMLElementTagNameMap[K]>;
export function createFactory<THTMLElement extends HTMLElement>(tagName: string, options?: ElementCreationOptions): TagFactory<THTMLElement>;
export function createFactory(tagName: string, options?: ElementCreationOptions): TagFactory<HTMLElement> {
	const element = document.createElement(tagName, options);
	return new TagFactory(element);
}

export function wrap<THTMLElement extends HTMLElement>(element: THTMLElement): TagFactory<THTMLElement> {
	return new TagFactory(element);
}

/**
 * 要素の追加位置。
 */
export const enum DomPosition {
	/** 最後。 */
	Last,
	/** 最初。 */
	First,
	/** 直前。 */
	Previous,
	/** 直後。 */
	Next,
}

/**
 * 指定した要素から見た特定の位置に要素をくっつける
 * @param parent 指定要素。
 * @param position 位置。
 * @param factory 追加する要素。
 */
export function attach(parent: Element, position: DomPosition, factory: NodeFactory): Node;
export function attach<TElement extends Element = Element>(parent: Element, position: DomPosition, factory: TagFactory<TElement>): TElement;
export function attach(parent: Element, position: DomPosition, node: Node): Node;
export function attach(parent: Element, position: DomPosition, node: Node | NodeFactory): Node {
	if (isNodeFactory(node)) {
		node = node.element;
	}

	switch (position) {
		case DomPosition.Last:
			return parent.appendChild(node);

		case DomPosition.First:
			return parent.insertBefore(node, parent.firstChild);

		case DomPosition.Previous:
			if (!parent.parentNode) {
				throw new TypeError('parent.parentNode');
			}
			return parent.parentNode.insertBefore(node, parent);

		case DomPosition.Next:
			if (!parent.parentNode) {
				throw new TypeError('parent.parentNode');
			}
			return parent.parentNode.insertBefore(node, parent.nextSibling);

		default:
			throw new throws.NotImplementedError();
	}
}

function isNodeFactory(arg: unknown): arg is NodeFactory {
	return types.hasObject(arg, 'element');
}

export interface NodeFactory {
	//#region property

	readonly element: Node;

	//#endregion
}

export class TextFactory implements NodeFactory {
	constructor(public readonly element: Text) {
	}
}

export class TagFactory<TElement extends Element> implements NodeFactory {
	constructor(public readonly element: TElement) {
	}

	/** @deprecated */
	public createTag<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, options?: ElementCreationOptions): TagFactory<HTMLElementDeprecatedTagNameMap[K]>;
	public createTag<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): TagFactory<HTMLElementTagNameMap[K]>;
	public createTag<THTMLElement extends HTMLElement>(tagName: string, options?: ElementCreationOptions): TagFactory<THTMLElement>;
	public createTag(tagName: string, options?: ElementCreationOptions): TagFactory<HTMLElement> {
		const createdElement = document.createElement(tagName, options);
		this.element.appendChild(createdElement);

		const nodeFactory = new TagFactory(createdElement);
		return nodeFactory;
	}

	public createText(text: string): TextFactory {
		const createdNode = document.createTextNode(text);
		this.element.appendChild(createdNode);

		const nodeFactory = new TextFactory(createdNode);
		return nodeFactory;

	}
}

