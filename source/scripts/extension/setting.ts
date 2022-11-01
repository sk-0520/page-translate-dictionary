// ユーザー(サイト翻訳機能提供者)があれこれやるやつ

export interface InformationSetting {
	//#region property

	website?: string | null;
	repository?: string | null;
	document?: string | null;

	//#endregion
}

export interface FilterSetting {
	//#region property

	lineBreak?: 'join' | 'raw' | null;
	whiteSpace?: 'join' | 'raw' | null;
	trim?: boolean;

	//#endregion
}

export interface MatchSetting {
	//#region property

	mode?: 'partial' | 'forward' | 'backward' | 'perfect' | 'regex' | null;
	ignoreCase?: boolean | null;
	pattern?: string | null;
	replace?: ReplaceSetting | null;

	//#endregion
}

export interface ReplaceSetting {
	//#region property

	mode?: 'normal' | 'common' | null;
	value: string | null;
	regex?: { [name: string]: { [key: string]: string } } | null;

	//#endregion
}

export interface TargetSetting {
	//#region property

	filter?: FilterSetting | null;
	matches?: Array<MatchSetting> | null;
	replace?: ReplaceSetting | null;

	//#endregion
}

export interface SelectorSetting {
	//#region property

	mode?: 'normal' | 'common' | null;
	value: string | null;
	node?: number | null;
	all?: boolean | null;

	//#endregion
}

export interface QuerySetting {
	//#region property

	selector?: SelectorSetting | null;
	text?: TargetSetting | null;
	value?: TargetSetting | null;
	attributes?: { [name: string]: TargetSetting | null; } | null;

	//#endregion
}

export interface PathSetting {
	//#region property

	query: QuerySetting[] | null;

	import?: string[] | null;

	//#endregion
}

/**
 * 共通設定
 */
export interface CommonSetting {
	//#region property

	/** 共通セレクタ設定 */
	selector?: { [key: string]: string | null } | null;

	/** 共通テキスト設定 */
	text?: { [key: string]: string | null } | null;

	/** 共通クエリ設定 */
	query?: { [key: string]: QuerySetting | null } | null;

	//#endregion
}

export type PathMap = { [path: string]: PathSetting | null };

export interface SiteSetting {
	//#region property

	/** 名前 */
	name: string;
	/** バージョン */
	version: string;
	/** 対象ホスト */
	hosts: string[];
	/** 設定情報 */
	information?: InformationSetting | null;
	/** 優先度 */
	level?: number | null;
	/** 変換先言語 */
	language?: string | null;

	/** パスに対する変換設定 */
	path?: PathMap | null;

	/** 変換共通処理 */
	common?: CommonSetting | null;

	//#endregion
}
