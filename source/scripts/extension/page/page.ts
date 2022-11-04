import * as config from '../config';
import * as uri from '../uri';
import * as translator from './translator';
import * as string from '../../core/string';
import * as loader from '../loader';
import * as names from '../names';
import * as storage from '../storage';
import '../../../styles/extension/page.scss';

type PageCache = {
	/** アプリケーション設定 */
	app: config.ApplicationConfiguration,
	/** サイト設定 */
	sites: ReadonlyArray<config.SiteConfiguration>,
	// /** 翻訳済み要素とその設定 */
	// translatedTargets: Map<config.QueryConfiguration, WeakSet<Element>>,
	/** 監視対象要素 TODO: Query は複数に対応しないと設定と矛盾が出る */
	watchers: Map<Element, config.QueryConfiguration>,
	/** 監視対象要素 */
	observer: MutationObserver;
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

function notifyBrowserIfTranslated() {
	const makClassNames = document.getElementsByClassName(names.ClassNames.mark);
	if (makClassNames.length) {
		// ここでロケーションバーとサイドバーの合わせ技したい
	}
}

function executeCoreAsync(pageCache: PageCache): Promise<Array<translator.TranslatedTarget>> {
	let targets = new Array<translator.TranslatedTarget>();

	for (const siteConfiguration of pageCache.sites) {
		//alert(JSON.stringify(siteConfiguration.path))
		//for (const [pathPattern, pathConfiguration] of Object.entries(siteConfiguration.path)) {
		//alert('siteConfiguration.path-> ' + JSON.stringify(siteConfiguration.path))
		for (const key in siteConfiguration.path) {
			// alert('key:: ' + key)
			const pathConfiguration = siteConfiguration.path[key];
			let urlPath = location.pathname;
			if (pathConfiguration.withSearch && !string.isNullOrEmpty(location.search)) {
				urlPath += '?' + location.search;
			}

			if (uri.isEnabledPath(urlPath, key)) {
				console.log('パス適合', key, urlPath);
				try {
					targets = translator.translate(pathConfiguration, siteConfiguration, pageCache.app.translate);
				} catch (ex) {
					console.error(ex);
				}
			} else {
				console.log('パス非適合', key, urlPath);
			}
		}
	}

	notifyBrowserIfTranslated();

	return Promise.resolve(targets);
}

function toMutationObserverInit(queryConfiguration: config.QueryConfiguration): MutationObserverInit {
	const options: MutationObserverInit = {
		childList: false,
		subtree: false,
	};

	if (queryConfiguration.text) {
		options.characterData = true;
	}
	if (queryConfiguration.attributes.size) {
		options.attributes = true;
		options.attributeFilter = [...queryConfiguration.attributes.keys()];
	}

	return options;
}

/**
 * 翻訳済み要素のキャッシュ・監視追加
 * @param pageCache 更新対象（直接操作される点に注意）
 * @param targets 翻訳済みデータ
 */
function updatePageCache(pageCache: PageCache, targets: ReadonlyArray<translator.TranslatedTarget>) {
	//
	pageCache.observer.disconnect();

	for (const target of targets) {
		// let translatedTarget = pageCache.translatedTargets.get(target.queryConfiguration);
		// if (translatedTarget) {
		// 	for (const element of target.elements) {
		// 		translatedTarget.add(element);
		// 	}
		// } else {
		// 	translatedTarget = new WeakSet(target.elements);
		// 	pageCache.translatedTargets.set(target.queryConfiguration, translatedTarget);
		// }

		// 監視登録
		if (target.queryConfiguration.selector.watch) {
			for (const element of target.elements) {
				if (!pageCache.watchers.has(element)) {
					console.debug('監視追加', element.textContent, target.queryConfiguration);
					pageCache.watchers.set(element, target.queryConfiguration);
				}
			}
		}
	}

	for (const [element, queryConfiguration] of pageCache.watchers) {
		const init = toMutationObserverInit(queryConfiguration);
		console.debug('監視対象', queryConfiguration, init);
		pageCache.observer.observe(element, init);
	}


}

async function executeAsync(pageCache: PageCache): Promise<void> {
	// const progressElement = createProgressElement();
	// document.body.appendChild(progressElement);
	let targets: Array<translator.TranslatedTarget>;
	try {
		console.time('TRANSLATE');
		targets = await executeCoreAsync(pageCache);
	} finally {
		// document.body.removeChild(progressElement);
		console.timeEnd('TRANSLATE');
	}

	updatePageCache(pageCache, targets);
}

function updatedPageAsync(event: Event): Promise<void> {
	console.log('updatedPage');
	if (pageCache) {
		return executeAsync(pageCache);
	}

	return Promise.resolve();
}

function modifyPageAsync(mutations: MutationRecord[]): Promise<void> {
	console.log('modifyPage', mutations);
	if (pageCache) {
		return executeAsync(pageCache);
	}

	return Promise.resolve();
}

async function onWatchMutationAsync(mutations: MutationRecord[], observer: MutationObserver): Promise<void> {
	console.log('なんかきた', mutations);
	alert('onWatchMutationAsync');
	return Promise.resolve();
}

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
		const site = await loader.saveAsync(siteHeadConfiguration.updateUrl, setting, siteHeadConfiguration.id);

		return site.head;
	} catch (ex) {
		console.warn(ex);
	}

	return null;
}

async function updateSiteConfigurationsAsync(currentDateTime: Date, setting: config.SettingConfiguration, allSiteHeadConfigurations: ReadonlyArray<config.SiteHeadConfiguration>, currentSiteHeadConfigurations: ReadonlyArray<config.SiteHeadConfiguration>): Promise<config.SiteHeadConfiguration[]> {
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

async function bootAsync(): Promise<boolean> {
	console.time('PAGE');
	const applicationConfiguration = await storage.loadApplicationAsync();
	const allSiteHeadConfigurations = await storage.loadSiteHeadsAsync();

	if (!allSiteHeadConfigurations.length) {
		console.trace('設定なし');
		return false;
	}

	const currentSiteHeadConfigurations = allSiteHeadConfigurations.filter(i => uri.isEnabledHosts(location.host, i.hosts));
	if (!currentSiteHeadConfigurations.length) {
		console.info(`ホストに該当する設定なし: ${location.host}`);
		return false;
	}

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

	const sortedCurrentSiteHeadConfigurations = currentSiteHeadConfigurations.sort((a, b) => a.level - b.level);
	for (const siteHeadConfiguration of sortedCurrentSiteHeadConfigurations) {
		const rawBody = await storage.loadSiteBodyAsync(siteHeadConfiguration.id);
		if (rawBody) {
			const siteConfiguration = new config.SiteConfigurationImpl(siteHeadConfiguration, rawBody);
			siteItems.push(siteConfiguration);
		}
	}

	console.timeEnd('PAGE');
	if (siteItems.length) {
		console.debug('きてます！');
		// 設定データ確定
		pageCache = {
			app: applicationConfiguration,
			sites: siteItems,
			//translatedTargets: new Map(),
			watchers: new Map(),
			observer: new MutationObserver((x, a) => {
				alert();
				onWatchMutationAsync(x, a);
			}),
		};
		await executeAsync(pageCache);
	} else {
		console.trace('きてない・・・', location.pathname);
	}

	// 子孫が追加された場合の監視(追加の監視の身で既にある要素は `watch` で対応すること)
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

export function boot() {
	document.addEventListener('pjax:end', ev => updatedPageAsync(ev));
	document.addEventListener('turbo:render', ev => updatedPageAsync(ev));

	bootAsync();
}
