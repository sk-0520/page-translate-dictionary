import webextension from "webextension-polyfill";
import * as dom from '../dom';
import * as localize from '../localize';
import * as storage from '../storage';
import * as config from '../config';
import * as loader from '../loader';
import '../../styles/application-options.scss';

class ImportLog {
	private _logElement: HTMLOListElement;
	constructor() {
		this._logElement = dom.requireElementById<HTMLOListElement>('import-log');
	}

	public clear() {
		this._logElement.innerHTML = '';
	}

	public add(message: string) {
		const li = document.createElement('li');
		li.textContent = message;
		this._logElement.appendChild(li);
	}
}

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

	dom.requireElementById('import').addEventListener('click', async ev => {
		ev.preventDefault();
		const url = prompt(webextension.i18n.getMessage('options_import_message'));
		if (url === null) {
			return;
		}
		const log = new ImportLog();
		log.clear();

		try {
			if (!loader.checkUrl(url)) {
				log.add(webextension.i18n.getMessage('options_import_log_invalid_url'));
				return;
			}

			const setting = await loader.fetchAsync(url);
			if(!setting) {
				log.add(webextension.i18n.getMessage('options_import_log_invalid_setting'));
				return;
			}
		} catch (ex) {
			if (ex instanceof Error) {
				log.add(ex.toString());
			} else {
				log.add(ex + '');
			}
		}
	})
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
	dom.requireElementById('processing').classList.add('processed');
}

export function boot() {
	bootAsync();
}
