import * as dom from '../dom';
import * as localize from '../localize';
import * as storage from '../storage';
import * as config from '../config';
import '../../styles/application-options.scss';

function setApplication(applicationConfiguration: config.IApplicationConfiguration) {
	dom.requireElementById<HTMLInputElement>('translate_markReplacedElement').checked = applicationConfiguration.translate.markReplacedElement;

	dom.requireElementById<HTMLInputElement>('setting_autoUpdate').checked = applicationConfiguration.setting.autoUpdate;
	dom.requireElementById<HTMLInputElement>('setting_periodDays').value = applicationConfiguration.setting.periodDays.toString();
}

function setSetting(siteHeadConfiguration: config.ISiteHeadConfiguration) {
}

function setSettings(siteHeadConfigurations: ReadonlyArray<config.ISiteHeadConfiguration>) {
	for (const siteHeadConfiguration of siteHeadConfigurations) {
		setSetting(siteHeadConfiguration);
	}
}

async function saveGenericAsync(): Promise<void> {
	const applicationConfiguration = await storage.loadApplicationAsync();

	applicationConfiguration.translate.markReplacedElement = dom.requireElementById<HTMLInputElement>('translate_markReplacedElement').checked;

	applicationConfiguration.setting.autoUpdate = dom.requireElementById<HTMLInputElement>('setting_autoUpdate').checked;
	const rawPeriodDays = dom.requireElementById<HTMLInputElement>('setting_periodDays').value;
	const periodDays = parseInt(rawPeriodDays);
	if (!isNaN(periodDays)) {
		applicationConfiguration.setting.periodDays = periodDays;
	}

	console.log(applicationConfiguration);

	await storage.saveApplicationAsync(applicationConfiguration);
}

async function bootAsync(): Promise<void> {
	const applicationTask = storage.loadApplicationAsync();
	const siteHeadersTask = storage.loadSiteHeadsAsync();

	localize.applyView();

	const application = await applicationTask;
	setApplication(application);

	const siteHeaders = await siteHeadersTask;
	setSettings(siteHeaders);

	dom.requireElementById('generic').addEventListener('submit', async ev => {
		ev.preventDefault();
		await saveGenericAsync();
	})

	dom.requireElementById('options').classList.remove('loading');
	dom.requireElementById('loading').remove();
}

export function boot() {
	bootAsync();
}
