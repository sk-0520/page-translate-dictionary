
/**
 * 要素は `HTMLInputElement` か。
 * @param element
 * @returns
 */
export function isInputElement(element: Element): element is HTMLInputElement {
	return element.tagName === 'INPUT';
}
