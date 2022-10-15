import * as config from '../config';
import * as url from '../url';
import * as logging from '../logging';
import * as translator from './translator';
//import * as names from '../names';
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
		for (const [pathPattern, pathConfiguration] of Object.entries(siteConfiguration.path)) {
			if (url.isEnabledPath(location.pathname, pathPattern)) {
				logger.trace('きた！！', pathPattern);
				translator.translate(pathConfiguration, siteConfiguration, pageConfiguration.app.translate);
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

async function bootAsync(): Promise<void> {
	const currentSiteHeadConfigurations = await storage.loadSiteHeadsAsync();
	const appConfigTask = storage.loadApplicationAsync();

	if (!currentSiteHeadConfigurations.length) {
		logger.trace('無視！');
		return;
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
		const appConfig = await appConfigTask;
		pageConfiguration = {
			app: appConfig,
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
