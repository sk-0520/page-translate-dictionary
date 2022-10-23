import webextension from "webextension-polyfill";
import * as JSONC from 'jsonc-parser';
import * as setting from './setting';
import * as config from './config';
import * as common from './common';
import * as type from './type';
import * as storage from './storage';

export function checkUrl(s: string): boolean {
	return s.startsWith('https://') || s.startsWith('http://');
}

export function throwIfInvalidString(obj: any, property: string) {
	if (!type.hasPrimaryProperty(obj, property, 'string')) {
		throw new Error(property);
	}
	if (common.isNullOrWhiteSpace(obj[property])) {
		throw new Error(property);
	}
}

export async function fetchAsync(url: string): Promise<setting.ISiteSetting | null> {
	const manifest = webextension.runtime.getManifest();

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			//'Content-Type': 'application/json',
			'X-WebExtensions': `${manifest.name} ${manifest.version}`,
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP Status: ${response.status} (${response.statusText})`);
	}

	const body = await response.text();

	const json = JSONC.parse(body, undefined, {
		allowEmptyContent: true,
		allowTrailingComma: true,
		disallowComments: true,
	});

	throwIfInvalidString(json, 'name');
	throwIfInvalidString(json, 'version');
	if (!type.hasArrayProperty(json, 'hosts')) {
		throw new Error('hosts');
	}
	for (let i = 0; i < json['hosts'].length; i++) {
		const item = json['hosts'][i];
		if (typeof item !== 'string') {
			throw new Error(`hosts[${i}]: ${item}`);
		}
	}

	return json as setting.ISiteSetting;
}

export async function updateAsync(siteHeadConfiguration: config.ISiteHeadConfiguration): Promise<config.Site> {
	const setting = await fetchAsync(siteHeadConfiguration.updateUrl);
	if (!setting) {
		throw new Error('setting error: ' + siteHeadConfiguration.updateUrl);
	}

	const site = await saveAsync(siteHeadConfiguration.updateUrl, setting, siteHeadConfiguration.id);

	return site;
}

export function createSiteConfigurationId(): config.SiteConfigurationId {
	return crypto.randomUUID();
}

export function convertInformation(information: setting.IInformationSetting | null | undefined): config.ISiteInformationConfiguration {
	const result: config.ISiteInformationConfiguration = {
		websiteUrl: type.getPrimaryPropertyOr(information, 'website', 'string', ''),
		repositoryUrl: type.getPrimaryPropertyOr(information, 'repository', 'string', ''),
		documentUrl: type.getPrimaryPropertyOr(information, 'document', 'string', ''),
	};

	return result;
}

export function convertLevel(level: number | null | undefined): number {
	if (typeof level === 'number') {
		return level;
	}

	return 0;
}

export function convertLanguage(language: string | null | undefined): string {
	if (typeof language === 'string') {
		return language;
	}

	return '';
}

export async function hasSiteSettingAsync(url: string): Promise<config.SiteConfigurationId | null> {
	const heads = await storage.loadSiteHeadsAsync();

	const target = heads.filter(i => i.updateUrl === url);
	if (!target.length) {
		return null;
	}

	return target[0].id;
}

export async function saveAsync(updateUrl: string, setting: setting.ISiteSetting, siteId: config.SiteConfigurationId | null): Promise<config.Site> {
	const timestamp = (new Date()).toISOString();
	const isCreateMode = common.isNullOrWhiteSpace(siteId);

	const head: config.ISiteHeadConfiguration = {
		id: isCreateMode ? createSiteConfigurationId() : siteId!,
		updateUrl: updateUrl,
		updatedTimestamp: timestamp,
		lastCheckedTimestamp: timestamp,
		name: setting.name,
		version: setting.version,
		hosts: setting.hosts,
		information: convertInformation(setting?.information),
		level: convertLevel(setting?.level),
		language: convertLanguage(setting?.language),
	};
	const body: config.ISiteBodyConfiguration = {
		path: setting.path,
		common: setting.common,
	};

	await storage.saveSiteBodyAsync(head.id, body);
	if (isCreateMode) {
		await storage.addSiteHeadsAsync(head);
	} else {
		const currentHeaders = await storage.loadSiteHeadsAsync();
		const newHeaders = currentHeaders.filter(i => i.id !== siteId);
		newHeaders.push(head);
		await storage.saveSiteHeadsAsync(newHeaders);
	}

	return {
		head: head,
		body: body,
	};
}
