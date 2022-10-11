
enum WhiteSpace {
	Join = 'join',
	Raw = 'raw',
}

enum LineBreak {
	Join = 'join',
	Raw = 'raw',
}

enum MatchMode {
	Partial = 'partial',
	Forward = 'forward',
	Backward = 'backward',
	Regex = 'regex',
}

enum ReplaceMode {
	Normal = 'normal',
	Common = 'common',
}

interface IFilterConfiguration {
	//#region property

	trim: boolean;
	whiteSpace: WhiteSpace;
	lineBreak: LineBreak;

	//#endregion
}

interface IMatchConfiguration {
	//#region property

	mode: MatchMode;
	ignoreCase: boolean;
	pattern: string;

	//#endregion
}

interface IReplaceConfiguration {
	//#region property

	mode: ReplaceMode;
	value: string;

	//#endregion
}

interface ITargetConfiguration {
	//#region property

	filter: IFilterConfiguration;
	match: IMatchConfiguration;
	replace: IReplaceConfiguration;

	//#endregion
}

interface IQueryConfiguration {
	//#region property

	text: ITargetConfiguration;
	value: ITargetConfiguration;
	attributes: { [name: string]: ITargetConfiguration };

	//#endregion
}

interface IPathConfiguration {
	//#region property

	selector: { [selector: string]: string }

	//#endregion
}

/**
 * 共通設定
 */
interface ICommonConfiguration {
	//#region property

	/** 共通セレクタ設定 */
	selector: { [key: string]: string }

	/** 共通テキスト設定 */
	text: { [key: string]: string }

	//#endregion
}

interface ISiteConfiguration {
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

	//#endregion
}
