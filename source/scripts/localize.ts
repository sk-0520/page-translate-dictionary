import webextension from "webextension-polyfill";
import * as common from "./common";

/**
 * 拡張機能のビューに対してローカライズを実施。
 *
 * * `data-we-text`: テキスト設定
 * * `data-we-attr-*`: 属性設定
 *
 * @param element
 */
export function applyElement(element: HTMLElement): void {
	for (const attribute of element.attributes) {
		if (!attribute.name.startsWith('data-we-')) {
			continue;
		}

		if (attribute.name === 'data-we-text') {
			const message = webextension.i18n.getMessage(attribute.value);
			if (!common.isNullOrWhiteSpace(message)) {
				element.textContent = message;
			}
		} else {
			const attrName = attribute.name.substring('data-we-'.length);
			const message = webextension.i18n.getMessage(attribute.value);
			if (!common.isNullOrWhiteSpace(message)) {
				element.setAttribute(attrName, message);
			}
		}
	}

}

/**
 * 拡張機能のビューに対してローカライズを実施。
 */
export function applyView(): void {
	const elementList = document.querySelectorAll<HTMLElement>('*');
	for (const element of elementList) {
		applyElement(element);
	}
}
