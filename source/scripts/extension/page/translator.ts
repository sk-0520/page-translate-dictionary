import * as config from '../config';
import * as names from '../names';
import * as converter from './converter';

/** 翻訳済み要素とその設定 */
export interface TranslatedTarget {
	elements: ReadonlyArray<Element>;
	queryConfiguration: config.QueryConfiguration;
}

export function translateElement(element: Element, queryConfiguration: config.QueryConfiguration, commonConfiguration: config.CommonConfiguration, site: config.SiteId): boolean {
	let translated = false;

	for (const [attributeName, targetConfiguration] of queryConfiguration.attributes) {
		const sourceValue = element.getAttribute(attributeName);
		if (sourceValue) {
			const output = converter.convert(sourceValue, targetConfiguration, commonConfiguration, site);
			if (output) {
				element.setAttribute(attributeName, output);
				element.setAttribute(names.Attributes.attributeHead + attributeName, sourceValue);
				translated = true;
			}
		}
	}

	if (element.textContent && queryConfiguration.text) {

		const nodes = new Map<number, Text | Element>();

		if (queryConfiguration.selector.node) {
			const textNodes = new Array<Text>();
			for (const node of element.childNodes) {
				if (node instanceof Text) {
					textNodes.push(node);
				}
			}

			if (queryConfiguration.selector.node < 0 && queryConfiguration.text.matches) {
				// 全てのテキストノードを対象とする(条件設定は必須)
				for (let i = 0; i < textNodes.length; i++) {
					nodes.set(i + 1, textNodes[i]);
				}
			} else if ((queryConfiguration.selector.node - 1) < textNodes.length) {
				const node = textNodes[queryConfiguration.selector.node - 1];
				nodes.set(queryConfiguration.selector.node, node);
			}
		}

		if (!nodes.size) {
			nodes.set(0, element);
		}
		for (const [number, node] of nodes) {
			const sourceValue = node.textContent || '';

			const output = converter.convert(sourceValue, queryConfiguration.text, commonConfiguration, site);
			if (output) {
				if (node instanceof Text) {
					node.textContent = output;
				} else {
					element.textContent = output;
				}
				element.setAttribute(names.Attributes.textHead + number, sourceValue);
				translated = true;

				if (queryConfiguration.selector.node === -1) {
					break;
				}
			}
		}
	}

	if (translated) {
		element.setAttribute(names.Attributes.translated, '');
	}

	return translated;
}

function translateCore(queryConfiguration: config.QueryConfiguration, siteConfiguration: config.SiteConfiguration, translateConfiguration: Readonly<config.TranslateConfiguration>): TranslatedTarget | null {
	console.debug('query:', queryConfiguration);

	const currentSelectors = queryConfiguration.selector.mode === config.SelectorMode.Common
		? siteConfiguration.common.selector.get(queryConfiguration.selector.value)
		: queryConfiguration.selector.value
		;

	if (!currentSelectors) {
		console.debug('empty currentSelectors');
		return null;
	}

	const elements = new Array<Element>();

	if (queryConfiguration.selector.all) {
		const elementList = document.querySelectorAll(currentSelectors);
		elements.push(...elementList);
	} else {
		const element = document.querySelector(currentSelectors);
		if (element) {
			elements.push(element);
		}
	}
	if (!elements.length) {
		console.debug('selector not match:', currentSelectors)
		return null;
	}

	for (const element of elements) {
		if (translateElement(element, queryConfiguration, siteConfiguration.common, siteConfiguration)) {
			if (translateConfiguration.markReplacedElement) {
				element.classList.add(names.ClassNames.mark);
			}
		}
	}

	const result: TranslatedTarget = {
		elements: elements,
		queryConfiguration: queryConfiguration,
	};

	return result;
}

export function translate(pathConfiguration: config.PathConfiguration, siteConfiguration: config.SiteConfiguration, translateConfiguration: Readonly<config.TranslateConfiguration>): Array<TranslatedTarget> {

	const targets = new Array<TranslatedTarget>();

	for (const queryConfiguration of pathConfiguration.query) {
		const target = translateCore(queryConfiguration, siteConfiguration, translateConfiguration);
		if (target) {
			targets.push(target);
		}
	}

	for (const name of pathConfiguration.import) {
		const queryConfiguration = siteConfiguration.common.query.get(name);
		if (queryConfiguration) {
			const target = translateCore(queryConfiguration, siteConfiguration, translateConfiguration);
			if (target) {
				targets.push(target);
			}
		}
	}

	return targets;
}
