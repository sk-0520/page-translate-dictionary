import * as config from '../config';
import * as uri from '../uri';
import * as translator from './translator';
import * as string from '../../core/string';
import * as loader from '../loader';
import * as storage from '../storage';
import '../../../styles/extension/page.scss';

type PageConfiguration = {
	app: config.ApplicationConfiguration,
	sites: ReadonlyArray<config.SiteConfiguration>,
};
let pageConfiguration: PageConfiguration | null;

// function createProgressElement(): HTMLElement {
// 	const progressElement = document.createElement('div');
// 	progressElement.classList.add(names.ClassNames.progress)

// 	progressElement.appendChild(
// 		document.createTextNode('置き換え中...')
// 	);

// 	return progressElement;
// }

function executeCoreAsync(pageConfiguration: PageConfiguration): Promise<void> {
	for (const siteConfiguration of pageConfiguration.sites) {
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
				console.trace('パス適合', key, urlPath);
				try {
					translator.translate(pathConfiguration, siteConfiguration, pageConfiguration.app.translate);
				} catch (ex) {
					console.error(ex);
				}
			} else {
				console.trace('パス非適合', key, urlPath);
			}
		}
	}

	return Promise.resolve();
}



function executeAsync(pageConfiguration: PageConfiguration): Promise<void> {
	// const progressElement = createProgressElement();
	// document.body.appendChild(progressElement);
	try {
		console.time('TRANSLATE');
		return executeCoreAsync(pageConfiguration);
	} finally {
		// document.body.removeChild(progressElement);
		console.timeEnd('TRANSLATE');
	}
}

function updatedPage(event: Event): Promise<void> {
	console.log('updatedPage');
	if (pageConfiguration) {
		return executeAsync(pageConfiguration);
	}

	return Promise.resolve();
}

function modifyPageAsync(mutations: MutationRecord[]): Promise<void> {
	console.log('modifyPage', mutations);
	if (pageConfiguration) {
		return executeAsync(pageConfiguration);
	}

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
		pageConfiguration = {
			app: applicationConfiguration,
			sites: siteItems,
		};
		await executeAsync(pageConfiguration);
	} else {
		console.trace('きてない・・・', location.pathname);
	}

	if (!applicationConfiguration.setting.updatedBeforeTranslation && applicationConfiguration.setting.autoUpdate) {
		console.debug('翻訳後 設定更新処理実施');
		updateSiteConfigurationsAsync(currentDateTime, applicationConfiguration.setting, allSiteHeadConfigurations, currentSiteHeadConfigurations);
	}

	return 0 < siteItems.length;
}

export function boot() {
	document.addEventListener('pjax:end', ev => updatedPage(ev));
	document.addEventListener('turbo:render', ev => updatedPage(ev));

	bootAsync().then(fit => {
		if (!fit) {
			return;
		}
		const bodyMutationOptions: MutationObserverInit = {
			childList: true,
			subtree: true,
		};
		var bodyMutationObserver = new MutationObserver(mutations => {
			bodyMutationObserver.disconnect();
			modifyPageAsync(mutations).then(() => {
				bodyMutationObserver.observe(document.body, bodyMutationOptions);
			});
		});
		bodyMutationObserver.observe(document.body, bodyMutationOptions);
	})
}
