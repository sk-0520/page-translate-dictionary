import webextension from "webextension-polyfill";
import * as JSONC from 'jsonc-parser';
import * as setting from './setting';
import * as config from './config';
import * as types from '../core/types';
import * as storage from './storage';
import * as string from "../core/string";

function throwIfInvalidString(obj: any, property: string) {
	if (!types.hasPrimaryProperty(obj, property, 'string')) {
		throw new Error(property);
	}
	if (string.isNullOrWhiteSpace(obj[property])) {
		throw new Error(property);
	}
}

export async function fetchAsync(url: string): Promise<setting.SiteSetting | null> {
	const manifest = webextension.runtime.getManifest();

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'User-Agent': navigator.userAgent,
			'X-Extension': `${manifest.short_name} ${manifest.version}`,
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
	if (!types.hasArrayProperty(json, 'hosts')) {
		throw new Error('hosts');
	}
	for (let i = 0; i < json['hosts'].length; i++) {
		const item = json['hosts'][i];
		if (typeof item !== 'string') {
			throw new Error(`hosts[${i}]: ${item}`);
		}
	}

	return json as any as setting.SiteSetting;
}

export function createSiteInternalId(): config.SiteInternalId {
	return crypto.randomUUID();
}

export function convertInformation(information: setting.InformationSetting | null | undefined): config.InformationConfiguration {
	const result: config.InformationConfiguration = {
		websiteUrl: types.getPrimaryPropertyOr(information, 'website', 'string', ''),
		repositoryUrl: types.getPrimaryPropertyOr(information, 'repository', 'string', ''),
		documentUrl: types.getPrimaryPropertyOr(information, 'document', 'string', ''),
	};

	return result;
}

export function convertPriority(priority: number | null | undefined): number {
	if (typeof priority === 'number') {
		return priority;
	}

	return 0;
}

export function convertLanguage(language: string | null | undefined): string {
	if (typeof language === 'string') {
		return language;
	}

	return '';
}

export async function hasSiteSettingAsync(url: string): Promise<config.SiteInternalId | null> {
	const heads = await storage.loadSiteHeadsAsync();

	const target = heads.filter(i => i.updateUrl === url);
	if (!target.length) {
		return null;
	}

	return target[0].id;
}

export async function saveAsync(updateUrl: string, setting: setting.SiteSetting, siteId: config.SiteInternalId | null): Promise<config.SiteData> {
	const timestamp = (new Date()).toISOString();
	const isCreateMode = string.isNullOrWhiteSpace(siteId);

	const head: config.SiteHeadConfiguration = {
		id: isCreateMode ? createSiteInternalId() : siteId!,
		updateUrl: updateUrl,
		updatedTimestamp: timestamp,
		lastCheckedTimestamp: timestamp,
		name: setting.name,
		version: setting.version,
		hosts: setting.hosts,
		information: convertInformation(setting?.information),
		priority: convertPriority(setting?.priority),
		language: convertLanguage(setting?.language),
	};
	const body: config.SiteBodyConfiguration = {
		watch: setting.watch ?? {},
		path: setting.path ?? {},
		common: setting.common ?? {},
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
