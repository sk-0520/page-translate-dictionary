import webextension from "webextension-polyfill";
import * as dom from '../dom';
import * as localize from '../localize';
import * as storage from '../storage';
import * as config from '../config';
import * as loader from '../loader';
import * as common from '../common';
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

function updateItemInformation(siteHeadConfiguration: config.ISiteHeadConfiguration, itemRootElement: HTMLElement) {
	dom.requireSelector('[name="name"]', itemRootElement).textContent = siteHeadConfiguration.name;
	dom.requireSelector('[name="version"]', itemRootElement).textContent = siteHeadConfiguration.version;
	const updatedTimestampElement = dom.requireSelector<HTMLTimeElement>('[name="updated-timestamp"]', itemRootElement);
	updatedTimestampElement.textContent = siteHeadConfiguration.updatedTimestamp;
	updatedTimestampElement.dateTime = siteHeadConfiguration.updatedTimestamp;
	const hostsElement = dom.requireSelector('[name="hosts"]', itemRootElement);

	for (const host of siteHeadConfiguration.hosts) {
		const li = document.createElement('li');
		li.textContent = host;
		hostsElement.appendChild(li);
	}
}

function addSetting(siteHeadConfiguration: config.ISiteHeadConfiguration) {
	const templateElement = dom.requireElementById<HTMLTemplateElement>('template-define-item');
	const itemRootElement = dom.cloneTemplate(templateElement);
	for (const element of itemRootElement.querySelectorAll<HTMLElement>('*')) {
		localize.applyElement(element);
	}

	dom.requireSelector('[name="action"]', itemRootElement).addEventListener('click', async ev => {
		ev.preventDefault();
		const element = ev.currentTarget as HTMLButtonElement;
		element.disabled = true;
		const prev = element.textContent;
		try {
			element.textContent = element.dataset['updating']!;
			//TODO: 更新処理
			await common.sleepAsync(3 * 1000);
		} finally {
			element.disabled = false;
			element.textContent = prev;
		}
	}, false);
	dom.requireSelector('[name="id"]', itemRootElement).textContent = siteHeadConfiguration.id;
	dom.requireSelector('[name="delete"]', itemRootElement).addEventListener('click', async ev => {
		const element = ev.currentTarget as HTMLButtonElement;
		const itemElement = dom.requireClosest('.list-item', element);
		itemElement.remove();

		const headers = await storage.loadSiteHeadsAsync();
		const targetHeaders = headers.filter(i => i.id === siteHeadConfiguration.id);
		const removedHeaders = headers.filter(i => i.id !== siteHeadConfiguration.id);
		await storage.saveSiteHeadsAsync(removedHeaders);
		for(const head of targetHeaders) {
			await storage.deleteSiteBodyAsync(head.id);
		}
	});
	updateItemInformation(siteHeadConfiguration, itemRootElement);

	const definesElement = dom.requireElementById<HTMLOListElement>('defines');
	definesElement.appendChild(itemRootElement);

}

async function importSettingAsync(url: string): Promise<void> {
	const log = new ImportLog();
	log.clear();

	try {
		log.add(webextension.i18n.getMessage('options_import_log_start'));

		if (!loader.checkUrl(url)) {
			log.add(webextension.i18n.getMessage('options_import_log_invalid_url'));
			return;
		}

		const existsId = await loader.hasSiteSettingAsync(url);
		if (existsId !== null) {
			log.add(webextension.i18n.getMessage('options_import_log_duplicated', existsId));
			return;
		}

		log.add(webextension.i18n.getMessage('options_import_log_fetch_url', [url]));
		const setting = await loader.fetchAsync(url);
		if (!setting) {
			log.add(webextension.i18n.getMessage('options_import_log_invalid_setting'));
			return;
		}

		log.add(webextension.i18n.getMessage('options_import_log_setting', [setting.name, setting.version]));
		for (const host of setting.hosts) {
			log.add(webextension.i18n.getMessage('options_import_log_host', [host]));
		}

		// 内部用データとして取り込み
		log.add(webextension.i18n.getMessage('options_import_log_convert'));

		const configPair = await loader.saveAsync(url, setting);

		log.add(webextension.i18n.getMessage('options_import_log_success'));

		addSetting(configPair.head);

	} catch (ex) {
		if (ex instanceof Error) {
			log.add(ex.toString());
		} else {
			log.add(ex + '');
		}
	}
}

function setSettings(siteHeadConfigurations: ReadonlyArray<config.ISiteHeadConfiguration>) {
	for (const siteHeadConfiguration of siteHeadConfigurations) {
		addSetting(siteHeadConfiguration);
	}

	dom.requireElementById('import').addEventListener('click', async ev => {
		ev.preventDefault();
		const url = prompt(webextension.i18n.getMessage('options_import_message'));
		if (url === null) {
			return;
		}
		await importSettingAsync(url);
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
