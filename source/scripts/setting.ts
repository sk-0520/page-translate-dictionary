// ユーザー(サイト翻訳機能提供者)があれこれやるやつ

export enum WhiteSpace {
	Join = 'join',
	Raw = 'raw',
}

export enum LineBreak {
	Join = 'join',
	Raw = 'raw',
}

export enum MatchMode {
	Partial = 'partial',
	Forward = 'forward',
	Backward = 'backward',
	Regex = 'regex',
}

export enum ReplaceMode {
	Normal = 'normal',
	Common = 'common',
}

export interface IFilterSetting {
	//#region property

	trim?: boolean;
	whiteSpace?: WhiteSpace;
	lineBreak?: LineBreak;

	//#endregion
}

export interface IMatchSetting {
	//#region property

	mode?: MatchMode;
	ignoreCase?: boolean;
	pattern: string;

	//#endregion
}

export interface IReplaceSetting {
	//#region property

	mode?: ReplaceMode;
	value: string;

	//#endregion
}

export interface ITargetSetting {
	//#region property

	filter?: IFilterSetting;
	match?: IMatchSetting;
	replace: IReplaceSetting;

	//#endregion
}

export interface IQuerySetting {
	//#region property

	text?: ITargetSetting;
	value?: ITargetSetting;
	attributes?: { [name: string]: ITargetSetting };

	//#endregion
}

export interface IPathSetting {
	//#region property

	selector: { [selector: string]: IQuerySetting }

	//#endregion
}

/**
 * 共通設定
 */
export interface ICommonSetting {
	//#region property

	/** 共通セレクタ設定 */
	selector?: { [key: string]: string }

	/** 共通テキスト設定 */
	text?: { [key: string]: string }

	//#endregion
}

export interface ISiteSetting {
	//#region property

	/** 名前 */
	name: string;
	/** バージョン */
	version: string;
	/** 対象ホスト */
	host: string;
	/** 優先度 */
	level: number;
	/** 変換先言語 */
	language: string;

	path: { [path: string]: IPathSetting }

	common?: ICommonSetting;

	//#endregion
}

