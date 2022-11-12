/**
 * ID から要素取得を強制。
 *
 * @param elementId
 * @returns
 */
export function requireElementById<THtmlElement extends HTMLElement>(elementId: string): THtmlElement {
	const result = document.getElementById(elementId);
	if (!result) {
		throw new Error(elementId);
	}

	return result as THtmlElement;
}

/**
 * セレクタから要素取得を強制。
 *
 * @param selectors
 * @param element
 * @returns
 */

export function requireSelector<K extends keyof HTMLElementTagNameMap>(selectors: K, element?: Element): HTMLElementTagNameMap[K];
export function requireSelector<K extends keyof SVGElementTagNameMap>(selectors: K, element?: Element): SVGElementTagNameMap[K];
export function requireSelector<TElement extends Element = Element>(selectors: string, element?: Element | null): TElement;
export function requireSelector(selectors: string, element?: Element | null): Element {
	const result = (element ?? document).querySelector(selectors);
	if (!result) {
		throw new Error(selectors);
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
export function requireClosest<K extends keyof HTMLElementTagNameMap>(selectors: K, element: Element): HTMLElementTagNameMap[K];
export function requireClosest<K extends keyof SVGElementTagNameMap>(selectors: K, element: Element): SVGElementTagNameMap[K];
export function requireClosest<E extends Element = Element>(selectors: string, element: Element): E;
export function requireClosest(selectors: string, element: Element): Element {
	const result = element.closest(selectors);
	if (!result) {
		throw new Error(selectors);
	}

	return result;
}

/**
 * 対象要素から所属する `Form` 要素を取得する。
 * @param element `Form` に所属する要素。
 * @returns
 */
export function getParentForm(element: Element): HTMLFormElement {
	const formElement = requireClosest('form', element);
	if (formElement === null) {
		throw new Error(element.outerHTML);
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
			throw new Error(input + ': ' + element.tagName);
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
	if (value == undefined) {
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
	if (value == undefined) {
		return fallback;
	}

	return value;
}

// /**
//  * 指定要素を兄弟間で上下させる。
//  * @param current 対象要素。
//  * @param isUp 上に移動させるか(偽の場合下に移動)。
//  */
// export function moveElement(current: HTMLElement, isUp: boolean): void {
// 	const refElement = isUp
// 		? current.previousElementSibling
// 		: current.nextElementSibling
// 		;

// 	if (refElement) {
// 		const newItem = isUp ? current : refElement;
// 		const oldItem = isUp ? refElement : current;
// 		current.parentElement!.insertBefore(newItem, oldItem);
// 	}
// }

export function createTag(tagName: string, options?: ElementCreationOptions): TagFactory<HTMLElement> {
	const element = document.createElement(tagName, options);
	return new TagFactory(element);
}

export function createHtml<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HtmlFactory<HTMLElementTagNameMap[K]> {
	const element = document.createElement(tagName, options);
	return new HtmlFactory(element);
}

export function wrap<THTMLElement extends HTMLElement>(element: THTMLElement): TagFactory<THTMLElement> {
	return new TagFactory(element);
}

export function append(parent: Element, tree: NodeFactory): Node {
	return parent.appendChild(tree.element);
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

	public createTag(tagName: string, options?: ElementCreationOptions): TagFactory<HTMLElement> {
		const createdElement = document.createElement(tagName, options);
		this.element.appendChild(createdElement);

		const node = new HtmlFactory(createdElement);
		return node;
	}

	public createHtml<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HtmlFactory<HTMLElementTagNameMap[K]> {
		const createdElement = document.createElement(tagName, options);
		this.element.appendChild(createdElement);

		const node = new HtmlFactory(createdElement);
		return node;
	}

	public createText(text: string): TextFactory {
		const createdNode = document.createTextNode(text);
		this.element.appendChild(createdNode);

		const node = new TextFactory(createdNode);
		return node;

	}
}

export class HtmlFactory<TElement extends Element> extends TagFactory<TElement> {
	constructor(element: TElement) {
		super(element);
	}
}
