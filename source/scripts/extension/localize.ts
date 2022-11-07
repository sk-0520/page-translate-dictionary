import webextension from "webextension-polyfill";
import * as string from "../core/string";

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
 * 拡張機能のビューに対してローカライズを実施。
 */
export function applyView(): void {
	const elementList = document.querySelectorAll('*');
	for (const element of elementList) {
		applyElement(element);
	}
}
