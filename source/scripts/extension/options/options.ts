import webextension from "webextension-polyfill";
import * as dom from '../../core/dom';
import * as localize from '../localize';
import * as storage from '../storage';
import * as config from '../config';
import * as url from '../../core/url';
import * as loader from '../loader';
import ImportLogger from './ImportLogger';
import * as extensions from '../extensions';
import '../../../styles/extension/application-options.scss';

function setApplication(applicationConfiguration: config.ApplicationConfiguration) {
	dom.requireElementById('translate_markReplacedElement', HTMLInputElement).checked = applicationConfiguration.translate.markReplacedElement;

	dom.requireElementById('setting_autoUpdate', HTMLInputElement).checked = applicationConfiguration.setting.autoUpdate;
	dom.requireElementById('setting_updatedBeforeTranslation', HTMLInputElement).checked = applicationConfiguration.setting.updatedBeforeTranslation;
	dom.requireElementById('setting_periodDays', HTMLInputElement).value = applicationConfiguration.setting.periodDays.toString();
}

function updateItemInformation(siteHeadConfiguration: config.SiteHeadConfiguration, itemRootElement: Element | DocumentFragment) {
	dom.requireSelector(itemRootElement, '[name="name"]').textContent = siteHeadConfiguration.name;
	dom.requireSelector(itemRootElement, '[name="version"]').textContent = siteHeadConfiguration.version;
	const updatedTimestampElement = dom.requireSelector(itemRootElement, '[name="updated-timestamp"]', HTMLTimeElement);
	updatedTimestampElement.textContent = siteHeadConfiguration.updatedTimestamp;
	updatedTimestampElement.dateTime = siteHeadConfiguration.updatedTimestamp;
	const hostsElement = dom.requireSelector(itemRootElement, '[name="hosts"]');
	hostsElement.innerHTML = '';
	for (const host of siteHeadConfiguration.hosts) {
		const hostRootElement = dom.cloneTemplate('#template-setting-item-host');

		const hostElement = dom.requireSelector(hostRootElement, '[name="host"]');
		hostElement.textContent = host;

		hostsElement.appendChild(hostRootElement);
	}

	const details = [
		{ name: 'update-url', url: siteHeadConfiguration.updateUrl },
		{ name: 'website-url', url: siteHeadConfiguration.information.websiteUrl },
		{ name: 'repository-url', url: siteHeadConfiguration.information.repositoryUrl },
		{ name: 'document-url', url: siteHeadConfiguration.information.documentUrl },
	];
	for (const detail of details) {
		const detailElement = dom.requireSelector<HTMLAnchorElement>(itemRootElement, `[name="${detail.name}"]`);

		if (url.isHttpUrl(detail.url)) {
			detailElement.href = detail.url;
			detailElement.target = `${detail.name}_${siteHeadConfiguration.id}`
			detailElement.textContent = detail.url;
		} else {
			dom.requireClosest(detailElement, 'tr').remove();
		}
	}
}

function addSetting(siteHeadConfiguration: config.SiteHeadConfiguration) {
	const itemRootElement = dom.cloneTemplate('#template-setting-item');
	localize.applyNestElements(itemRootElement);

	dom.requireSelector(itemRootElement, '.setting-item', HTMLElement).dataset['head'] = JSON.stringify(siteHeadConfiguration);

	dom.requireSelector(itemRootElement, '[name="action"]').addEventListener('click', async ev => {
		ev.preventDefault();
		const element = ev.currentTarget as HTMLButtonElement;
		const itemElement = dom.requireClosest(element, '.setting-item', HTMLElement);
		const currentSiteHeadConfiguration = JSON.parse(itemElement.dataset['head']!);
		element.disabled = true;
		const prev = element.textContent;
		try {
			element.textContent = element.dataset['updating']!;

			const setting = await loader.fetchAsync(currentSiteHeadConfiguration.updateUrl);
			if (!setting) {
				return;
			}

			const site = await loader.saveAsync(currentSiteHeadConfiguration.updateUrl, setting, siteHeadConfiguration.id);
			itemElement.dataset['head'] = JSON.stringify(site.head);
			updateItemInformation(site.head, itemElement);
		} finally {
			element.disabled = false;
			element.textContent = prev;
		}
	}, false);
	dom.requireSelector(itemRootElement, '[name="id"]').textContent = siteHeadConfiguration.id;
	dom.requireSelector(itemRootElement, '[name="delete"]').addEventListener('click', async ev => {
		const element = ev.currentTarget as HTMLButtonElement;
		const itemElement = dom.requireClosest(element, '.setting-item');
		itemElement.remove();

		const heads = await storage.loadSiteHeadsAsync();
		const targetHeads = heads.filter(i => i.id === siteHeadConfiguration.id);
		const removedHeads = heads.filter(i => i.id !== siteHeadConfiguration.id);
		await storage.saveSiteHeadsAsync(removedHeads);
		for (const head of targetHeads) {
			await storage.deleteSiteBodyAsync(head.id);
		}
	});
	updateItemInformation(siteHeadConfiguration, itemRootElement);

	const settingsElement = dom.requireElementById('settings');
	settingsElement.appendChild(itemRootElement);

}

async function importSettingAsync(settingUrl: string): Promise<void> {
	const log = new ImportLogger();
	log.clear();

	try {
		log.add(webextension.i18n.getMessage('options_import_log_start'));

		if (!url.isHttpUrl(settingUrl)) {
			log.add(webextension.i18n.getMessage('options_import_log_invalid_url'));
			return;
		}

		const existsId = await loader.hasSiteSettingAsync(settingUrl);
		if (existsId !== null) {
			log.add(webextension.i18n.getMessage('options_import_log_duplicated', existsId));
			return;
		}

		log.add(webextension.i18n.getMessage('options_import_log_fetch_url', [settingUrl]));
		const setting = await loader.fetchAsync(settingUrl);
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

		const site = await loader.saveAsync(settingUrl, setting, null);

		log.add(webextension.i18n.getMessage('options_import_log_success'));

		addSetting(site.head);

	} catch (ex) {
		if (ex instanceof Error) {
			log.add(ex.toString());
		} else {
			log.add(ex + '');
		}
	}
}

function setSettings(siteHeadConfigurations: ReadonlyArray<config.SiteHeadConfiguration>) {
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

	applicationConfiguration.translate.markReplacedElement = dom.requireElementById('translate_markReplacedElement', HTMLInputElement).checked;

	applicationConfiguration.setting.autoUpdate = dom.requireElementById('setting_autoUpdate', HTMLInputElement).checked;
	applicationConfiguration.setting.updatedBeforeTranslation = dom.requireElementById('setting_updatedBeforeTranslation', HTMLInputElement).checked;

	const rawPeriodDays = dom.requireElementById('setting_periodDays', HTMLInputElement).value;
	const periodDays = parseInt(rawPeriodDays);
	if (!isNaN(periodDays)) {
		applicationConfiguration.setting.periodDays = periodDays;
	}

	console.log(applicationConfiguration);

	await storage.saveApplicationAsync(applicationConfiguration);
}

async function bootAsync(extension: extensions.Extension): Promise<void> {
	const applicationTask = storage.loadApplicationAsync();
	const siteHeadsTask = storage.loadSiteHeadsAsync();

	localize.applyView();

	const application = await applicationTask;
	setApplication(application);

	let siteHeads = await siteHeadsTask;
	siteHeads = siteHeads.sort((a, b) => {
		if (a.name === b.name) {
			return a.name.localeCompare(b.name);
		}

		return a.id.localeCompare(b.id);
	});

	setSettings(siteHeads);

	dom.requireElementById('generic').addEventListener('submit', async ev => {
		ev.preventDefault();
		await saveGenericAsync();
	})

	dom.requireElementById('options').classList.remove('loading');
	dom.requireElementById('processing').classList.add('processed');
}

export function boot(extension: extensions.Extension) {
	bootAsync(extension);
}
