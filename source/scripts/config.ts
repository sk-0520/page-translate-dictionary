/**
 * 内部使用する(ある程度データが確定している)設定
 */
import * as setting from './setting';
import * as common from './common';

export type SiteConfigurationId = string;

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

	trim: boolean;
	whiteSpace: WhiteSpace;
	lineBreak: LineBreak;

	//#endregion
}

export interface IMatchConfiguration {
	//#region property

	mode: MatchMode;
	ignoreCase: boolean;
	pattern: string;

	//#endregion
}

export interface IReplaceConfiguration {
	//#region property

	mode: ReplaceMode;
	value: string;

	//#endregion
}

export interface ITargetConfiguration {
	//#region property

	filter: IFilterConfiguration;
	match?: IMatchConfiguration;
	replace: IReplaceConfiguration;

	//#endregion
}

export interface IQueryConfiguration {
	//#region property

	text?: ITargetConfiguration;
	value?: ITargetConfiguration;
	attributes: { [name: string]: ITargetConfiguration };

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
	selector: { [key: string]: string }

	/** 共通テキスト設定 */
	text: { [key: string]: string }

	//#endregion
}


export interface ITranslateConfiguration {
	//#region property

	/**
	 * 置き換えた要素に対して視覚的マークを設定するか。
	 */
	markReplacedElement: boolean;

	//#endregion
}

export interface IApplicationConfiguration {
	//#region property

	translate: ITranslateConfiguration;

	//#endregion
}

export interface ISiteHeadConfiguration {
	//#region property

	/** 設定データの一意キー(自動採番) */
	id: SiteConfigurationId,
	/** 設定ファイルのダウンロードURL */
	updateUrl: string,
	/** 設定ファイルの最終更新日 */
	updatedTimestamp: string,

	/** 名前 */
	name: string;
	/** バージョン */
	version: string;
	/** 対象ホスト */
	hosts: string[];
	/** 優先度 */
	level: number;
	/** 変換先言語 */
	language: string;

	//#endregion
}

export interface ISiteBodyConfiguration {
	//#region property

	path?: setting.PathMap | null

	common?: setting.ICommonSetting | null;

	//#endregion
}

export type PathMap = { [path: string]: IPathConfiguration };

export interface ISiteConfiguration extends ISiteHeadConfiguration {
	//#region property

	path: PathMap;

	common: ICommonConfiguration;

	//#endregion
}

export class SiteConfiguration implements ISiteConfiguration {

	private readonly _path: PathMap;
	private readonly _common: ICommonConfiguration;

	public constructor(
		private readonly head: ISiteHeadConfiguration,
		body: ISiteBodyConfiguration
	) {
		// ここで全部のデータを補正
		this._path = SiteConfiguration.convertPath(body.path || null);
		this._common = SiteConfiguration.convertCommon(body.common || null);
	}

	//#region function

	public static convertPath(raw: setting.PathMap | null): { [path: string]: IPathConfiguration } {
		throw new Error();
	}

	public static convertCommon(raw: setting.ICommonSetting | null): ICommonConfiguration {
		if (!raw) {
			return {
				selector: {},
				text: {},
			};
		}

		const result: ICommonConfiguration = {
			selector: {},
			text: {},
		};

		if ('selector' in raw && raw.selector && typeof raw.selector === 'object') {
			for (const [key, selector] of Object.entries(raw.selector)) {
				if (!common.isNullOrWhiteSpace(selector)) {
					result.selector[key] = selector!;
				}
			}
		}

		if ('text' in raw && raw.text && typeof raw.text === 'object') {
			for (const [key, text] of Object.entries(raw.text)) {
				if (!common.isNullOrWhiteSpace(text)) {
					result.text[key] = text!;
				}
			}
		}

		return result;
	}

	//#endregion

	//#region ISiteConfiguration

	public get id(): string {
		return this.head.id;
	}

	public get updateUrl(): string {
		return this.head.id;
	}

	public get updatedTimestamp(): string {
		return this.head.updatedTimestamp;
	}

	public get name(): string {
		return this.head.name;
	}

	public get version(): string {
		return this.head.version;
	}

	public get hosts(): string[] {
		return this.head.hosts;
	}

	public get level(): number {
		return this.head.level;
	}

	public get language(): string {
		return this.head.language;
	}

	public get path(): PathMap {
		return this._path;
	}

	public get common(): ICommonConfiguration {
		return this._common;
	}


	//#endregion
}
