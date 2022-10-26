import * as config from '../config';
import * as url from '../url';
import * as logging from '../../core/logging';
import * as translator from './translator';
import * as string from '../../core/string';
import * as loader from '../loader';
import * as storage from '../storage';
import '../../../styles/extension/page.scss';

const logger = logging.create('page-content');

type PageConfiguration = {
	app: config.IApplicationConfiguration,
	sites: ReadonlyArray<config.ISiteConfiguration>,
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

			if (url.isEnabledPath(urlPath, key)) {
				logger.trace('パス適合', key, urlPath);
				try {
					translator.translate(pathConfiguration, siteConfiguration, pageConfiguration.app.translate);
				} catch (ex) {
					logger.error(ex);
				}
			} else {
				logger.trace('パス非適合', key, urlPath);
			}
		}
	}

	return Promise.resolve();
}



function executeAsync(pageConfiguration: PageConfiguration): Promise<void> {
	// const progressElement = createProgressElement();
	// document.body.appendChild(progressElement);
	try {
		console.time('PAGE');
		return executeCoreAsync(pageConfiguration);
	} finally {
		// document.body.removeChild(progressElement);
		console.timeEnd('PAGE');
	}

	return Promise.resolve();
}

function updatedPage(event: Event) {
	logger.info('updatedPage');
	if (pageConfiguration) {
		executeAsync(pageConfiguration);
	}
}

async function updateSiteConfigurationAsync(siteHeadConfiguration: config.ISiteHeadConfiguration, force: boolean): Promise<config.ISiteHeadConfiguration | null> {
	try {
		const setting = await loader.fetchAsync(siteHeadConfiguration.updateUrl);
		if (!setting) {
			logger.warn('設定データ異常');
			return null;
		}

		if (force) {
			logger.debug('強制アップデート');
		} else if (setting.version === siteHeadConfiguration.version) {
			logger.info('設定のデータバージョン同じ');
			return null;
		}
		const site = await loader.saveAsync(siteHeadConfiguration.updateUrl, setting, siteHeadConfiguration.id);

		return site.head;
	} catch (ex) {
		console.warn(ex);
	}

	return null;
}

async function updateSiteConfigurationsAsync(currentDateTime: Date, setting: config.ISettingConfiguration, allSiteHeadConfigurations: ReadonlyArray<config.ISiteHeadConfiguration>): Promise<config.ISiteHeadConfiguration[]> {
	const headItems = new Array<config.ISiteHeadConfiguration>();

	for (const currentSiteHeadConfiguration of allSiteHeadConfigurations) {
		const lastCheckedTimestamp = new Date(currentSiteHeadConfiguration.lastCheckedTimestamp)
		lastCheckedTimestamp.setDate(lastCheckedTimestamp.getDate() + setting.periodDays);

		if (lastCheckedTimestamp < currentDateTime) {
			logger.info("CHECK NEW VERSION", lastCheckedTimestamp.toISOString(), '<', currentDateTime.toISOString(), currentSiteHeadConfiguration.id);
			const newSiteHead = await updateSiteConfigurationAsync(currentSiteHeadConfiguration, setting.periodDays === 0);
			if (newSiteHead) {
				logger.info("UPDATE!!", currentSiteHeadConfiguration.id);
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

async function bootAsync(): Promise<void> {
	const applicationConfiguration = await storage.loadApplicationAsync();
	const siteHeadConfigurations = await storage.loadSiteHeadsAsync();

	if (!siteHeadConfigurations.length) {
		logger.trace('設定なし');
		return;
	}

	const currentSiteHeadConfigurations = siteHeadConfigurations.filter(i => url.isEnabledHosts(location.host, i.hosts));
	if (!currentSiteHeadConfigurations.length) {
		logger.info(`ホストに該当する設定なし: ${location.host}`);
		return;
	}

	// アップデート確認等々
	const currentDateTime = new Date();
	const headItems = new Array<config.ISiteHeadConfiguration>();

	if (applicationConfiguration.setting.updatedBeforeTranslation && applicationConfiguration.setting.autoUpdate) {
		logger.info('翻訳前 設定更新処理実施');
		const newHeadItems = await updateSiteConfigurationsAsync(currentDateTime, applicationConfiguration.setting, currentSiteHeadConfigurations);
		headItems.push(...newHeadItems);
	} else {
		headItems.push(...currentSiteHeadConfigurations);
	}


	const siteItems = new Array<config.ISiteConfiguration>();

	const sortedCurrentSiteHeadConfigurations = currentSiteHeadConfigurations.sort((a, b) => a.level - b.level);
	for (const siteHeadConfiguration of sortedCurrentSiteHeadConfigurations) {
		const rawBody = await storage.loadSiteBodyAsync(siteHeadConfiguration.id);
		if (rawBody) {
			const siteConfiguration = new config.SiteConfiguration(siteHeadConfiguration, rawBody);
			siteItems.push(siteConfiguration);
		}
	}

	if (siteItems.length) {
		logger.debug('きてます！');
		// 設定データ確定
		pageConfiguration = {
			app: applicationConfiguration,
			sites: siteItems,
		};
		await executeAsync(pageConfiguration);
	} else {
		logger.trace('きてない・・・', location.pathname);
	}

	if (!applicationConfiguration.setting.updatedBeforeTranslation && applicationConfiguration.setting.autoUpdate) {
		logger.debug('翻訳後 設定更新処理実施');
		updateSiteConfigurationsAsync(currentDateTime, applicationConfiguration.setting, currentSiteHeadConfigurations);
	}

}

export function boot() {
	document.addEventListener('pjax:end', ev => updatedPage(ev));
	document.addEventListener('turbo:render', ev => updatedPage(ev));

	bootAsync();
}
