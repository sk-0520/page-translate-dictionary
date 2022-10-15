import webextension from "webextension-polyfill";
import * as type from "./type";
import * as config from "./config";
import * as logging from "./logging";

const logger = logging.create('storage');


const Keys = {
	application: 'application',
	siteHeads: 'site-head',
	siteBody: 'site-body-',
}

/**
 * アプリケーション設定を読み込む。
 * @returns 読み込み失敗時はデフォルトデータとしてのアプリケーション設定を返す。
 */
export async function loadApplicationAsync(): Promise<config.IApplicationConfiguration> {
	const obj = await webextension.storage.local.get(Keys.application);
	if (type.isApplicationConfiguration(obj)) {
		return obj;
	}

	logger.info('アプリ設定初期データ返却');

	return {
		translate: {
			markReplacedElement: true,
		},
	};
}

/**
 * サイト設定ヘッダ一覧を取得。
 * @returns 読み込み失敗データは無視される。
 */
export async function loadSiteHeadsAsync(): Promise<Array<config.ISiteHeadConfiguration>> {
	const obj = await webextension.storage.local.get(Keys.siteHeads);
	if (!Array.isArray(obj)) {
		return [];
	}

	const result = new Array<config.ISiteHeadConfiguration>();
	for (const item of obj) {
		if (type.isSiteHeadConfiguration(item)) {
			result.push(item);
		} else {
			logger.warn('type error', item);
		}
	}

	return result;
}

/**
 * サイト設定本体を取得。
 * @param id
 * @returns 存在しない場合は `null`。存在する場合は多分本体データを返す(型確認をしない)
 */
export async function loadSiteBodyAsync(id: config.SiteConfigurationId): Promise<config.ISiteBodyConfiguration | null> {
	const obj = await webextension.storage.local.get(Keys.siteBody + id);
	if (obj) {
		// 実際に使用する際に補正しまくる
		return obj as config.ISiteBodyConfiguration;
	}

	logger.warn('null', id);
	return null;
}
