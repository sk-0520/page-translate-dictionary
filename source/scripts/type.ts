import * as config from './config';

/**
 * 要素は `HTMLInputElement` か。
 * @param element
 * @returns
 */
export function isInputElement(element: Element): element is HTMLInputElement {
	return element.tagName === 'INPUT';
}

export function isTranslateConfiguration(obj: any): obj is config.ITranslateConfiguration {
	return obj !== null
		&& obj.markReplacedElement !== undefined && typeof obj.markReplacedElement === 'boolean'
		;
}

export function isApplicationConfiguration(obj: any): obj is config.IApplicationConfiguration {
	return obj !== null
		&& obj.translate !== undefined && isTranslateConfiguration(obj.translate)
		;
}

export function isSiteHeadConfiguration(obj: any): obj is config.ISiteHeadConfiguration {
	return obj != null
		&& obj.id !== undefined && typeof obj.id === 'string'
		&& obj.updateUrl !== undefined && typeof obj.updateUrl === 'string'
		&& obj.updatedTimestamp !== undefined && typeof obj.updatedTimestamp === 'string'
		&& obj.name !== undefined && typeof obj.name === 'string'
		&& obj.version !== undefined && typeof obj.version === 'string'
		&& obj.hosts !== undefined && Array.isArray(obj.hosts)
		&& obj.level !== undefined && typeof obj.level === 'number'
		&& obj.language !== undefined && typeof obj.language === 'string'
		;
}
