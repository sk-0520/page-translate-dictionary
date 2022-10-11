
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

export interface IFilterConfiguration {
	//#region property

	trim?: boolean;
	whiteSpace?: WhiteSpace;
	lineBreak?: LineBreak;

	//#endregion
}

export interface IMatchConfiguration {
	//#region property

	mode?: MatchMode;
	ignoreCase?: boolean;
	pattern: string;

	//#endregion
}

export interface IReplaceConfiguration {
	//#region property

	mode?: ReplaceMode;
	value: string;

	//#endregion
}

export interface ITargetConfiguration {
	//#region property

	filter?: IFilterConfiguration;
	match?: IMatchConfiguration;
	replace: IReplaceConfiguration;

	//#endregion
}

export interface IQueryConfiguration {
	//#region property

	text?: ITargetConfiguration;
	value?: ITargetConfiguration;
	attributes?: { [name: string]: ITargetConfiguration };

	//#endregion
}

export interface IPathConfiguration {
	//#region property

	selector: { [selector: string]: IQueryConfiguration }

	//#endregion
}

/**
 * 共通設定
 */
export interface ICommonConfiguration {
	//#region property

	/** 共通セレクタ設定 */
	selector?: { [key: string]: string }

	/** 共通テキスト設定 */
	text?: { [key: string]: string }

	//#endregion
}

export interface ISiteConfiguration {
	//#region property

	/** 名前 */
	name: string;
	/** バージョン */
	version: string;
	/** 対象ドメイン */
	domain: string;
	/** 優先度 */
	level: number;
	/** 変換先言語 */
	language: string;

	path: { [path: string]: IPathConfiguration }

	common?: ICommonConfiguration;

	//#endregion
}
