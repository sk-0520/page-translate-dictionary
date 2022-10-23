import * as config from '../config';
import * as url from '../url';
import * as logging from '../logging';
import * as translator from './translator';
//import * as names from '../names';
import * as loader from '../loader';
import * as storage from '../storage';
import '../../styles/page.scss';

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
		alert(JSON.stringify(siteConfiguration))
		for (const [pathPattern, pathConfiguration] of Object.entries(siteConfiguration.path)) {
			if (url.isEnabledPath(location.pathname, pathPattern)) {
				logger.trace('パス適合', pathPattern);
				try {
					translator.translate(pathConfiguration, siteConfiguration, pageConfiguration.app.translate);
				} catch (ex) {
					logger.error(ex);
				}
			} else {
				logger.trace('パス非適合', pathPattern);
			}
		}
	}

	return Promise.resolve();
}



function executeAsync(pageConfiguration: PageConfiguration): Promise<void> {
	// const progressElement = createProgressElement();
	// document.body.appendChild(progressElement);
	try {
		return executeCoreAsync(pageConfiguration);
	} finally {
		// document.body.removeChild(progressElement);
	}

	return Promise.resolve();
}

function update(event: Event) {
	logger.info('update');
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

	if (applicationConfiguration.setting.autoUpdate) {
		for (const currentSiteHeadConfiguration of currentSiteHeadConfigurations) {
			const lastCheckedTimestamp = new Date(currentSiteHeadConfiguration.lastCheckedTimestamp)
			lastCheckedTimestamp.setDate(lastCheckedTimestamp.getDate() + applicationConfiguration.setting.periodDays);

			if (lastCheckedTimestamp < currentDateTime) {
				logger.info("CHECK NEW VERSION", lastCheckedTimestamp.toISOString(), '<', currentDateTime.toISOString(), currentSiteHeadConfiguration.id);
				const newSiteHead = await updateSiteConfigurationAsync(currentSiteHeadConfiguration, applicationConfiguration.setting.periodDays === 0);
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

		let newSiteHeadConfigurations = siteHeadConfigurations;
		for (const headItem of headItems) {
			newSiteHeadConfigurations = newSiteHeadConfigurations.filter(i => i.id !== headItem.id);
		}
		for (const headItem of headItems) {
			newSiteHeadConfigurations.push(headItem);
		}

		storage.saveSiteHeadsAsync(newSiteHeadConfigurations);
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
		return executeAsync(pageConfiguration);
	} else {
		logger.trace('きてない・・・', location.pathname);
	}

}

export function boot() {
	document.addEventListener('pjax:end', ev => update(ev));
	document.addEventListener('turbo:render', ev => update(ev));

	bootAsync();
}
