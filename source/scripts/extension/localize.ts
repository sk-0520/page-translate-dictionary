import webextension from "webextension-polyfill";
import * as string from "../core/string";
import * as dom from "../core/dom";

const base = 'data-ext';
const LocalizeAttribute = {
	start: base + '-',
	text: base + '-text',
} as const;

/**
 * 拡張機能の要素に対してローカライズを実施。
 *
 * * `data-ext-text`: テキスト設定
 * * `data-ext-attr-*`: 属性設定
 *
 * @param element
 */
export function applyElement(element: Element): void {
	if (!element.attributes) {
		return;
	}

	for (const attribute of element.attributes) {
		if (!attribute.name.startsWith(LocalizeAttribute.start)) {
			continue;
		}

		if (attribute.name === LocalizeAttribute.text) {
			const message = webextension.i18n.getMessage(attribute.value);
			if (!string.isNullOrWhiteSpace(message)) {
				element.textContent = message;
			}
		} else {
			const attrName = attribute.name.substring(LocalizeAttribute.start.length);
			const message = webextension.i18n.getMessage(attribute.value);
			if (!string.isNullOrWhiteSpace(message)) {
				element.setAttribute(attrName, message);
			}
		}
	}
}


/**
 * 指定要素と子孫に対してローカライズを実施。
 *
 * 拡張機能内の動的生成要素に対して使用する想定。
 */
export function applyNestElements(parentElement: Element | DocumentFragment): void {
	if(parentElement instanceof Element) {
		applyElement(parentElement);
	}
	const elementList = dom.requireSelectorAll(parentElement, '*')
	for (const element of elementList) {
		applyElement(element);
	}
}

/**
 * 拡張機能のビューに対してローカライズを実施。
 */
export function applyView(): void {
	const elementList = dom.requireSelectorAll('*');
	for (const element of elementList) {
		applyElement(element);
	}
}
