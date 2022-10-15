// ユーザー(サイト翻訳機能提供者)があれこれやるやつ

export interface IFilterSetting {
	//#region property

	trim?: boolean;
	whiteSpace?: string | null;
	lineBreak?: string | null;

	//#endregion
}

export interface IMatchSetting {
	//#region property

	mode?: string | null;
	ignoreCase?: boolean | null;
	pattern: string | null;

	//#endregion
}

export interface IReplaceSetting {
	//#region property

	mode?: string | null;
	value: string | null;

	//#endregion
}

export interface ITargetSetting {
	//#region property

	filter?: IFilterSetting | null;
	match?: IMatchSetting | null;
	replace: IReplaceSetting | null;

	//#endregion
}

export interface IQuerySetting {
	//#region property

	text?: ITargetSetting | null;
	value?: ITargetSetting | null;
	attributes?: { [name: string]: ITargetSetting | null; } | null;

	//#endregion
}

export interface IPathSetting {
	//#region property

	selector: { [selector: string]: IQuerySetting | null } | null

	//#endregion
}

/**
 * 共通設定
 */
export interface ICommonSetting {
	//#region property

	/** 共通セレクタ設定 */
	selector?: { [key: string]: string | null } | null

	/** 共通テキスト設定 */
	text?: { [key: string]: string | null } | null

	//#endregion
}

export interface ISiteSetting {
	//#region property

	/** 名前 */
	name: string | null;
	/** バージョン */
	version: string | null;
	/** 対象ホスト */
	hosts: string[] | null;
	/** 優先度 */
	level: number | null;
	/** 変換先言語 */
	language: string | null;

	path: { [path: string]: IPathSetting | null } | null

	common?: ICommonSetting | null;

	//#endregion
}
