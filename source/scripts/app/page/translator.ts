import * as config from '../config';
import * as logging from '../../core/logging';
import * as names from '../names';
import * as type from '../type-guard';
import * as replacer from './replacer';

const logger = logging.create('translator');

function translateElement(element: Element, queryConfiguration: config.IQueryConfiguration, siteConfiguration: config.ISiteConfiguration): boolean {
	let translated = false;

	if (queryConfiguration.attributes) {
		for (const [attributeName, targetConfiguration] of Object.entries(queryConfiguration.attributes)) {
			const sourceValue = element.getAttribute(attributeName);
			if (sourceValue) {
				const output = replacer.replace(sourceValue, targetConfiguration, siteConfiguration);
				if (output) {
					element.setAttribute(attributeName, output);
					element.setAttribute(names.Attributes.attributeHead + attributeName, sourceValue);
					translated = true;
				}
			}
		}
	}

	if (type.isInputElement(element) && queryConfiguration.value) {
		const sourceValue = element.value;
		const output = replacer.replace(sourceValue, queryConfiguration.value, siteConfiguration);
		if (output) {
			element.value = output;
			element.setAttribute(names.Attributes.value, sourceValue);
			translated = true;
		}
	} else if (element.textContent && queryConfiguration.text) {

		const nodes = new Map<number, Text | Element>();

		if (queryConfiguration.selector.node) {
			const textNodes = new Array<Text>();
			for (const node of element.childNodes) {
				if (node instanceof Text) {
					textNodes.push(node);
				}
			}

			if (queryConfiguration.selector.node < 0 && queryConfiguration.text.match) {
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

			const output = replacer.replace(sourceValue, queryConfiguration.text, siteConfiguration);
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

function translateCore(queryConfiguration: config.IQueryConfiguration, siteConfiguration: config.ISiteConfiguration, translateConfiguration: config.ITranslateConfiguration): void {
	logger.debug('query:', queryConfiguration);

	const currentSelectors = queryConfiguration.selector.mode === config.SelectorMode.Common
		? siteConfiguration.common.selector[queryConfiguration.selector.value]
		: queryConfiguration.selector.value
		;

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
		logger.debug('selector not match:', currentSelectors)
		return;
	}

	for (const element of elements) {
		if (translateElement(element, queryConfiguration, siteConfiguration)) {
			if (translateConfiguration.markReplacedElement) {
				element.classList.add(names.ClassNames.mark);
			}
		}
	}

}

export function translate(pathConfiguration: config.IPathConfiguration, siteConfiguration: config.ISiteConfiguration, translateConfiguration: config.ITranslateConfiguration): void {

	for (const queryConfiguration of pathConfiguration.query) {
		translateCore(queryConfiguration, siteConfiguration, translateConfiguration);
	}

	for (const name of pathConfiguration.import) {
		if (name in siteConfiguration.common.query) {
			const queryConfiguration = siteConfiguration.common.query[name];
			translateCore(queryConfiguration, siteConfiguration, translateConfiguration);
		}
	}

	const makClassNames = document.getElementsByClassName(names.ClassNames.mark);
	if(makClassNames.length) {
		// ここでロケーションバーとサイドバーの合わせ技したい
	}
}
