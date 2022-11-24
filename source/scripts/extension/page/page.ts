import webextension from 'webextension-polyfill';

import * as config from '../config';
import * as uri from '../uri';
import * as translator from './translator';
import * as throws from '../../core/throws';
import * as string from '../../core/string';
import * as dom from '../../core/dom';
import * as types from '../../core/types';
//import * as logging from '../../core/logging';
import * as loader from '../loader';
import * as messages from '../messages';
import * as names from '../names';
import * as storage from '../storage';
import * as extensions from '../extensions';

import '../../../styles/extension/page-content.scss';

type PageCache = {
	/** アプリケーション設定 */
	app: config.ApplicationConfiguration,
	/** サイト設定 */
	sites: ReadonlyArray<config.SiteConfiguration>,
	/** キャッシュ構築時点での `<meta name=* content=*>` 一覧 */
	metaMap: ReadonlyMap<string, string>;
	//[watch:omit] // /** 翻訳済み要素とその設定 */
	//[watch:omit] // translatedTargets: Map<config.QueryConfiguration, WeakSet<Element>>,
	//[watch:omit] /** 監視対象要素 TODO: Query は複数に対応しないと設定と矛盾が出る */
	//[watch:omit] watchers: Map<Element, config.QueryConfiguration>,
	//[watch:omit] /** 監視対象要素 */
	//[watch:omit] observer: MutationObserver;
};
let pageCache: PageCache | null;

// function createProgressElement(): HTMLElement {
// 	const progressElement = document.createElement('div');
// 	progressElement.classList.add(names.ClassNames.progress)

// 	progressElement.appendChild(
// 		document.createTextNode('置き換え中...')
// 	);

// 	return progressElement;
// }

function executeCoreAsync(pageCache: PageCache): Promise<Array<translator.TranslatedTarget>> {
	let targets = new Array<translator.TranslatedTarget>();

	for (const siteConfiguration of pageCache.sites) {
		//alert(JSON.stringify(siteConfiguration.path))
		//for (const [pathPattern, pathConfiguration] of Object.entries(siteConfiguration.path)) {
		//alert('siteConfiguration.path-> ' + JSON.stringify(siteConfiguration.path))
		for (const [keyRegex, pathConfiguration] of siteConfiguration.path) {
			// alert('key:: ' + key)
			let urlPath = location.pathname;
			if (pathConfiguration && pathConfiguration.withSearch && !location.search) {
				urlPath += '?' + location.search;
			}

			if (pathConfiguration && keyRegex.test(urlPath)) {
				console.log('パス適合', keyRegex, urlPath);
				try {
					targets = translator.translate(pathConfiguration, siteConfiguration, pageCache.metaMap, pageCache.app.translate);
				} catch (ex) {
					console.error(ex);
				}
			} else {
				console.log('パス非適合', keyRegex, urlPath);
			}
		}
	}

	return Promise.resolve(targets);
}

//[watch:omit] function toMutationObserverInit(queryConfiguration: config.QueryConfiguration): MutationObserverInit {
//[watch:omit] 	const options: MutationObserverInit = {
//[watch:omit] 		childList: false,
//[watch:omit] 		subtree: false,
//[watch:omit] 	};
//[watch:omit]
//[watch:omit] 	if (queryConfiguration.text) {
//[watch:omit] 		options.characterData = true;
//[watch:omit] 	}
//[watch:omit] 	if (queryConfiguration.attributes.size) {
//[watch:omit] 		options.attributes = true;
//[watch:omit] 		options.attributeFilter = [...queryConfiguration.attributes.keys()];
//[watch:omit] 	}
//[watch:omit]
//[watch:omit] 	return options;
//[watch:omit] }

//[watch:omit] /**
//[watch:omit]  * 翻訳済み要素のキャッシュ・監視追加
//[watch:omit]  * @param pageCache 更新対象（直接操作される点に注意）
//[watch:omit]  * @param targets 翻訳済みデータ
//[watch:omit]  */
//[watch:omit] function updatePageCache(pageCache: PageCache, targets: ReadonlyArray<translator.TranslatedTarget>) {
//[watch:omit] 	//
//[watch:omit] 	pageCache.observer.disconnect();
//[watch:omit]
//[watch:omit] 	for (const target of targets) {
//[watch:omit] 		// let translatedTarget = pageCache.translatedTargets.get(target.queryConfiguration);
//[watch:omit] 		// if (translatedTarget) {
//[watch:omit] 		// 	for (const element of target.elements) {
//[watch:omit] 		// 		translatedTarget.add(element);
//[watch:omit] 		// 	}
//[watch:omit] 		// } else {
//[watch:omit] 		// 	translatedTarget = new WeakSet(target.elements);
//[watch:omit] 		// 	pageCache.translatedTargets.set(target.queryConfiguration, translatedTarget);
//[watch:omit] 		// }
//[watch:omit]
//[watch:omit] 		// 監視登録
//[watch:omit] 		if (target.queryConfiguration.selector.watch) {
//[watch:omit] 			for (const element of target.elements) {
//[watch:omit] 				if (!pageCache.watchers.has(element)) {
//[watch:omit] 					console.debug('監視追加', element.textContent, target.queryConfiguration);
//[watch:omit] 					pageCache.watchers.set(element, target.queryConfiguration);
//[watch:omit] 				}
//[watch:omit] 			}
//[watch:omit] 		}
//[watch:omit] 	}
//[watch:omit]
//[watch:omit] 	for (const [element, queryConfiguration] of pageCache.watchers) {
//[watch:omit] 		const init = toMutationObserverInit(queryConfiguration);
//[watch:omit] 		console.debug('監視対象', queryConfiguration, init);
//[watch:omit] 		pageCache.observer.observe(element, init);
//[watch:omit] 	}
//[watch:omit] }

async function executeAsync(pageCache: PageCache): Promise<void> {
	// const progressElement = createProgressElement();
	// document.body.appendChild(progressElement);
	//[watch:omit] let targets: Array<translator.TranslatedTarget>;
	try {
		console.time('翻訳処理');
		//[watch:omit] targets = await executeCoreAsync(pageCache);
		await executeCoreAsync(pageCache);
		await sendMessageAsync(messages.MessageKind.NotifyPageInformation);
	} finally {
		// document.body.removeChild(progressElement);
		console.timeEnd('翻訳処理');
	}

	//[watch:omit] updatePageCache(pageCache, targets);
}

function updatedPageAsync(event: Event): Promise<void> {
	console.log('updatedPage', event);
	if (pageCache) {
		return executeAsync(pageCache);
	}

	return Promise.resolve();
}

function modifyPageAsync(mutations: ReadonlyArray<MutationRecord>): Promise<void> {
	console.log('modifyPage', mutations);
	if (pageCache) {
		return executeAsync(pageCache);
	}

	return Promise.resolve();
}

//[watch:omit] async function onWatchMutationAsync(mutations: ReadonlyArray<MutationRecord>, observer: MutationObserver): Promise<void> {
//[watch:omit] 	console.trace('なんかきた: 現状未検証処理', mutations);
//[watch:omit] 	return Promise.resolve();
//[watch:omit] }

async function updateSiteConfigurationAsync(siteHeadConfiguration: config.SiteHeadConfiguration, force: boolean): Promise<config.SiteHeadConfiguration | null> {
	try {
		const setting = await loader.fetchAsync(siteHeadConfiguration.updateUrl);
		if (!setting) {
			console.warn('設定データ異常');
			return null;
		}

		if (force) {
			console.debug('強制アップデート');
		} else if (setting.version === siteHeadConfiguration.version) {
			console.info('設定のデータバージョン同じ');
			return null;
		}
		const site = await loader.saveAsync(siteHeadConfiguration.updateUrl, setting, siteHeadConfiguration.id, true);

		return site.head;
	} catch (ex) {
		console.warn(ex);
	}

	return null;
}

async function updateSiteConfigurationsAsync(currentDateTime: Date, setting: config.SettingConfiguration, allSiteHeadConfigurations: ReadonlyArray<config.SiteHeadConfiguration>, currentSiteHeadConfigurations: ReadonlyArray<config.SiteHeadConfiguration>): Promise<Array<config.SiteHeadConfiguration>> {
	const headItems = new Array<config.SiteHeadConfiguration>();

	for (const currentSiteHeadConfiguration of currentSiteHeadConfigurations) {
		const lastCheckedTimestamp = new Date(currentSiteHeadConfiguration.lastCheckedTimestamp)
		lastCheckedTimestamp.setDate(lastCheckedTimestamp.getDate() + setting.periodDays);

		if (lastCheckedTimestamp < currentDateTime) {
			console.info("CHECK NEW VERSION", lastCheckedTimestamp.toISOString(), '<', currentDateTime.toISOString(), currentSiteHeadConfiguration.id);
			const newSiteHead = await updateSiteConfigurationAsync(currentSiteHeadConfiguration, setting.periodDays === 0);
			if (newSiteHead) {
				console.info("UPDATE!!", currentSiteHeadConfiguration.id);
				newSiteHead.updatedTimestamp = currentDateTime.toISOString();
				headItems.push(newSiteHead);
			} else {
				headItems.push(currentSiteHeadConfiguration);
			}
		} else {
			headItems.push(currentSiteHeadConfiguration);
		}
	}

	for (const head of headItems) {
		head.lastCheckedTimestamp = currentDateTime.toISOString();
	}

	let newSiteHeadConfigurations = Array.from(allSiteHeadConfigurations);
	for (const headItem of headItems) {
		newSiteHeadConfigurations = newSiteHeadConfigurations.filter(i => i.id !== headItem.id);
	}
	for (const headItem of headItems) {
		newSiteHeadConfigurations.push(headItem);
	}

	await storage.saveSiteHeadsAsync(newSiteHeadConfigurations);

	return headItems;
}

function getExtensionAttributes(element: Element): Map<string, Attr> {
	const result = new Map<string, Attr>();

	for (const attribute of element.attributes) {
		const name = attribute.name;

		if (name.startsWith(names.Attributes.textHead)) {
			result.set(name, attribute);
			continue;
		}

		if (name.startsWith(names.Attributes.attributeHead)) {
			result.set(name, attribute);
			continue;
		}
	}

	return result;
}

function getPageInformation(): messages.PageInformation {
	if (!pageCache) {
		return {
			translatedElementCount: 0,
			translatedTotalCount: 0,
			settings: [],
		};
	}

	const translatedElementList = dom.requireSelectorAll(`[${names.Attributes.translated}]`);

	const translatedTotalCount = [...translatedElementList]
		.map(i => getExtensionAttributes(i))
		.map(i => i.size)
		.reduce((a, v) => a + v, 0)
		;

	const result: messages.PageInformation = {
		translatedElementCount: translatedElementList.length,
		translatedTotalCount: translatedTotalCount,
		settings: pageCache.sites.map(i => types.flatClone(i)),
	};

	return result;
}

function sendMessageAsync<T>(kind: messages.MessageKind.NotifyPageInformation): Promise<T> {
	switch (kind) {
		case messages.MessageKind.NotifyPageInformation:
			const result: messages.Message & messages.PageInformation = getPageInformation();
			result.kind = kind;
			return webextension.runtime.sendMessage(result);
	}
}


async function receiveMessageAsync(message: messages.Message, sender: webextension.Runtime.MessageSender): Promise<messages.Replay> {
	switch (message.kind) {
		case messages.MessageKind.GetPageInformation: {
			const result: messages.Replay = getPageInformation();
			return result;
		}

		default:
			throw new throws.NotImplementedError();
	}
}

function getMeta(): Map<string, string> {
	const metaElementList = document.getElementsByName('meta');
	const result = new Map<string, string>();

	for (const element of metaElementList) {
		const metaElement = element as HTMLMetaElement;
		if (!string.isNotWhiteSpace(metaElement.name)) {
			continue;
		}
		const content = metaElement.content || '';

		result.set(metaElement.name, content);
	}

	return result;
}

async function bootAsync(extension: extensions.Extension): Promise<boolean> {
	console.time('ページ判定');
	const applicationConfiguration = await storage.loadApplicationAsync();
	const allSiteHeadConfigurations = await storage.loadSiteHeadsAsync();

	if (!allSiteHeadConfigurations.length) {
		console.trace('設定なし');
		sendMessageAsync(messages.MessageKind.NotifyPageInformation);
		return false;
	}

	const currentSiteHeadConfigurations = allSiteHeadConfigurations
		.filter(i => i.isEnabled)
		.filter(i => uri.isEnabledHosts(location.host, i.hosts))
		;
	if (!currentSiteHeadConfigurations.length) {
		console.info(`ホストに該当する設定なし: ${location.host}`);
		sendMessageAsync(messages.MessageKind.NotifyPageInformation);
		return false;
	}

	webextension.runtime.onMessage.addListener((message, sender) => receiveMessageAsync(message, sender));

	// アップデート確認等々
	const currentDateTime = new Date();
	const headItems = new Array<config.SiteHeadConfiguration>();

	if (applicationConfiguration.setting.updatedBeforeTranslation && applicationConfiguration.setting.autoUpdate) {
		console.info('翻訳前 設定更新処理実施');
		const newHeadItems = await updateSiteConfigurationsAsync(currentDateTime, applicationConfiguration.setting, allSiteHeadConfigurations, currentSiteHeadConfigurations);
		headItems.push(...newHeadItems);
	} else {
		headItems.push(...currentSiteHeadConfigurations);
	}

	const siteItems = new Array<config.SiteConfiguration>();

	const sortedCurrentSiteHeadConfigurations = currentSiteHeadConfigurations.sort((a, b) => a.priority - b.priority);
	for (const siteHeadConfiguration of sortedCurrentSiteHeadConfigurations) {
		const rawBody = await storage.loadSiteBodyAsync(siteHeadConfiguration.id);
		if (rawBody) {
			const siteConfiguration = config.createSiteConfiguration(siteHeadConfiguration, rawBody);
			siteItems.push(siteConfiguration);
		}
	}

	console.timeEnd('ページ判定');
	if (siteItems.length) {
		console.debug('きてます！');
		// 設定データ確定
		pageCache = {
			app: applicationConfiguration,
			sites: siteItems,
			metaMap: getMeta(),
			//translatedTargets: new Map(),
			//[watch:omit] watchers: new Map(),
			//[watch:omit] observer: new MutationObserver((x, a) => {
			//[watch:omit] 	onWatchMutationAsync(x, a);
			//[watch:omit] }),
		};

		// イベント監視設定追加
		for (const siteItem of siteItems) {
			for (const eventName of siteItem.watch.window) {
				console.info('event:window', siteItem.name, eventName);
				window.addEventListener(eventName, ev => updatedPageAsync(ev));
			}
			if (extension.kind === extensions.BrowserKind.Firefox) {
				window.addEventListener('popstate', ev => {
					console.error('popstate');
					updatedPageAsync(ev);
				});
			}
			for (const eventName of siteItem.watch.document) {
				console.info('event:document', siteItem.name, eventName);
				document.addEventListener(eventName, ev => updatedPageAsync(ev));
			}
		}

		await executeAsync(pageCache);
	} else {
		console.trace('きてない・・・', location.pathname);
	}

	// 子孫が追加された場合の監視(追加の監視のみで、既にある要素は `watch` で対応すること)
	const bodyMutationOptions: MutationObserverInit = {
		childList: true,
		subtree: true,
	};
	const bodyMutationObserver = new MutationObserver(async mutations => {
		bodyMutationObserver.disconnect();

		await modifyPageAsync(mutations);

		bodyMutationObserver.observe(document.body, bodyMutationOptions);
	});
	bodyMutationObserver.observe(document.body, bodyMutationOptions);


	if (!applicationConfiguration.setting.updatedBeforeTranslation && applicationConfiguration.setting.autoUpdate) {
		console.debug('翻訳後 設定更新処理実施');
		updateSiteConfigurationsAsync(currentDateTime, applicationConfiguration.setting, allSiteHeadConfigurations, currentSiteHeadConfigurations);
	}

	return 0 < siteItems.length;
}

export function boot(extension: extensions.Extension) {
	bootAsync(extension);
}
