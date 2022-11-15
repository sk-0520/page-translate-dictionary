import * as types from '../../core/types';
import * as string from '../../core/string';
import * as throws from '../../core/throws';
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

	const sourceSave = !element.hasAttribute(names.Attributes.translated);

	const workElement = element.shadowRoot ?? element;

	for (const [attributeName, targetConfiguration] of queryConfiguration.attributes) {
		const sourceValue = element.getAttribute(attributeName);
		if (sourceValue) {
			const output = converter.convert(sourceValue, targetConfiguration, commonConfiguration, site);
			if (output) {
				element.setAttribute(attributeName, output);
				if (sourceSave) {
					element.setAttribute(names.Attributes.attributeHead + attributeName, sourceValue);
				}
				translated = true;
			}
		}
	}

	if (workElement.textContent && queryConfiguration.text) {

		const nodes = new Map<number, Text | Element | ShadowRoot>();

		if (queryConfiguration.selector.node) {
			const textNodes = new Array<Text>();
			for (const node of workElement.childNodes) {
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
			nodes.set(0, workElement);
		}
		for (const [number, node] of nodes) {
			const sourceValue = node.textContent || '';

			const output = converter.convert(sourceValue, queryConfiguration.text, commonConfiguration, site);
			if (output) {
				if (node instanceof Text) {
					node.textContent = output;
				} else {
					workElement.textContent = output;
				}

				if (sourceSave) {
					element.setAttribute(names.Attributes.textHead + number, sourceValue);
				}
				translated = true;

				if (queryConfiguration.selector.node === -1) {
					break;
				}
			}
		}
	}

	if (translated) {
		if (workElement instanceof ShadowRoot) {
			element.setAttribute(names.Attributes.translated, 'shadow');
		} else {
			element.setAttribute(names.Attributes.translated, 'light');
		}
	}

	return translated;
}

function convertModeMetaToMatch(meta: config.MetaContentMode): string.MatchMode {
	switch (meta) {
		case config.MetaContentMode.Partial:
			return string.MatchMode.Partial;

		case config.MetaContentMode.Forward:
			return string.MatchMode.Forward;

		case config.MetaContentMode.Backward:
			return string.MatchMode.Backward;

		case config.MetaContentMode.Perfect:
			return string.MatchMode.Perfect;

		case config.MetaContentMode.Regex:
			return string.MatchMode.Regex;

		default:
			throw new throws.NotImplementedError();
	}
}

function conditionMeta(content: string, metaConfiguration: config.MetaConfiguration): boolean {
	switch (metaConfiguration.mode) {
		case config.MetaContentMode.Ignore:
			return true;

		case config.MetaContentMode.NotEmpty:
			return string.isNotWhiteSpace(content);

		default:
			break;
	}

	const mode = convertModeMetaToMatch(metaConfiguration.mode);
	const result = string.match(content, metaConfiguration.pattern, metaConfiguration.ignoreCase, mode);
	return result.matched;
}

function translateCore(queryConfiguration: config.QueryConfiguration, siteConfiguration: config.SiteConfiguration, metaMap: ReadonlyMap<string, string>, translateConfiguration: Readonly<config.TranslateConfiguration>): TranslatedTarget | null {
	console.debug('query:', queryConfiguration);

	const currentSelectors = queryConfiguration.selector.mode === config.SelectorMode.Common
		? siteConfiguration.common.selector.get(queryConfiguration.selector.value)
		: queryConfiguration.selector.value
		;

	if (!currentSelectors) {
		console.debug('empty currentSelectors');
		return null;
	}

	if (queryConfiguration.selector.meta.size) {
		for (const [name, meta] of queryConfiguration.selector.meta) {
			const content = metaMap.get(name);
			if (types.isUndefined(content)) {
				console.debug('meta not found', name);
				return null;
			}
			if (!conditionMeta(content, meta)) {
				console.debug('condition: false', name, content, meta);
				return null;
			}
		}
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

			let setting = new Array<string>();
			const rawSettings = element.getAttribute(names.Attributes.translateSettings);
			if (rawSettings) {
				setting = rawSettings.split(',').map(i => i.trim());
			}
			setting.push(siteConfiguration.id);
			const uniqSetting = new Set(setting);
			element.setAttribute(names.Attributes.translateSettings, [...uniqSetting].join(','))
		}
	}

	const result: TranslatedTarget = {
		elements: elements,
		queryConfiguration: queryConfiguration,
	};

	return result;
}

export function translate(pathConfiguration: config.PathConfiguration, siteConfiguration: config.SiteConfiguration, metaMap: ReadonlyMap<string, string>, translateConfiguration: Readonly<config.TranslateConfiguration>): Array<TranslatedTarget> {

	const targets = new Array<TranslatedTarget>();

	for (const queryConfiguration of pathConfiguration.query) {
		const target = translateCore(queryConfiguration, siteConfiguration, metaMap, translateConfiguration);
		if (target) {
			targets.push(target);
		}
	}

	for (const name of pathConfiguration.import) {
		const queryConfiguration = siteConfiguration.common.query.get(name);
		if (queryConfiguration) {
			const target = translateCore(queryConfiguration, siteConfiguration, metaMap, translateConfiguration);
			if (target) {
				targets.push(target);
			}
		}
	}

	return targets;
}
