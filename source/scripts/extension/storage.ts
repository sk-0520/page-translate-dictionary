import webextension from "webextension-polyfill";
import * as type from "./type-guard";
import * as config from "./config";

const Keys = {
	application: 'application',
	siteHeads: 'site-head',
	siteBody: 'site-body-',
	background: 'background',
}

/**
 * アプリケーション設定を読み込む。
 * @returns 読み込み失敗時はデフォルトデータとしてのアプリケーション設定を返す。
 */
export async function loadApplicationAsync(): Promise<config.ApplicationConfiguration> {
	const defaultConfiguration: config.ApplicationConfiguration = {
		translate: {
			markReplacedElement: true,
		},
		setting: {
			autoUpdate: true,
			updatedBeforeTranslation: false,
			periodDays: 5,
		},
	};

	const record = await webextension.storage.local.get(Keys.application);
	if (record && Keys.application in record) {
		const obj = { ...defaultConfiguration, ...record[Keys.application] };
		if (type.isApplicationConfiguration(obj)) {
			return obj;
		}
	}

	console.info('アプリ設定初期データ返却');

	return defaultConfiguration;
}

/**
 * サイト設定ヘッダ一覧を取得。
 * @returns 読み込み失敗データは無視される。
 */
export async function loadSiteHeadsAsync(): Promise<Array<config.SiteHeadConfiguration>> {
	const record = await webextension.storage.local.get(Keys.siteHeads);

	if (record && Keys.siteHeads in record) {
		const result = new Array<config.SiteHeadConfiguration>();
		const obj = record[Keys.siteHeads];
		for (const item of obj) {
			if (type.isSiteHeadConfiguration(item)) {
				result.push(item);
			} else {
				console.warn('type error', item);
			}
		}

		return result;
	}

	return [];
}

/**
 * サイト設定本体を取得。
 * @param id
 * @returns 存在しない場合は `null`。存在する場合は多分本体データを返す(型確認をしない)
 */
export async function loadSiteBodyAsync(id: config.SiteInternalId): Promise<config.SiteBodyConfiguration | null> {
	const key = Keys.siteBody + id;
	const record = await webextension.storage.local.get(key);
	if (record && key in record) {
		const obj = record[key];
		// 実際に使用する際に補正しまくる
		return obj as config.SiteBodyConfiguration;
	}

	console.warn('null', id);
	return null;
}

export function saveApplicationAsync(applicationConfiguration: config.ApplicationConfiguration): Promise<void> {
	return webextension.storage.local.set({
		[Keys.application]: applicationConfiguration
	});
}

export async function saveSiteHeadsAsync(siteHeadConfigurations: ReadonlyArray<config.SiteHeadConfiguration>): Promise<void> {
	return webextension.storage.local.set({
		[Keys.siteHeads]: siteHeadConfigurations
	});
}

export async function addSiteHeadsAsync(siteHeadConfigurations: config.SiteHeadConfiguration): Promise<void> {
	const heads = await loadSiteHeadsAsync();
	heads.push(siteHeadConfigurations);
	await saveSiteHeadsAsync(heads);
}

export async function saveSiteBodyAsync(id: config.SiteInternalId, siteBodyConfiguration: config.SiteBodyConfiguration): Promise<void> {
	const key = Keys.siteBody + id;
	return webextension.storage.local.set({
		[key]: siteBodyConfiguration,
	});
}

export async function deleteSiteBodyAsync(id: config.SiteInternalId): Promise<void> {
	const key = Keys.siteBody + id;
	return webextension.storage.local.remove(key);
}
