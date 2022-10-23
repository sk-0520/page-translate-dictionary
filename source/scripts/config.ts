/**
 * 内部使用する(ある程度データが確定している)設定
 */
import * as setting from './setting';
import * as type from './type';
import * as common from './common';

export type SiteConfigurationId = string;

export interface ISiteInformationConfiguration
{
	//#region property

	websiteUrl: string;
	repositoryUrl: string;
	documentUrl: string;

	//#endregion
}

export const enum WhiteSpace {
	Join = 'join',
	Raw = 'raw',
}

export const enum LineBreak {
	Join = 'join',
	Raw = 'raw',
}

export const enum MatchMode {
	Partial = 'partial',
	Forward = 'forward',
	Backward = 'backward',
	Regex = 'regex',
}

export const enum ReplaceMode {
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
	match: IMatchConfiguration | null;
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

export interface ISettingConfiguration {
	//#region property

	/**
	 * 設定を自動アップデートするか。
	 */
	autoUpdate: boolean;


	/**
	 * 最終更新確認日から指定した期間を超えた設定を更新対象とする。
	 *
	 * `0` を指定した場合は毎回実施する(検証時に使用する想定)。
	 */
	periodDays: number;


	//#endregion
}

export interface IApplicationConfiguration {
	//#region property

	translate: ITranslateConfiguration;
	setting: ISettingConfiguration;

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
	/** 設定ファイルの最終更新確認日 */
	lastCheckedTimestamp: string,

	/** 名前 */
	name: string;
	/** バージョン */
	version: string;
	/** 対象ホスト */
	hosts: string[];
	/** 設定情報 */
	information: ISiteInformationConfiguration;
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

export type Site = {
	head: ISiteHeadConfiguration,
	body: ISiteBodyConfiguration,
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

	private static convertEnum<TEnum>(raw: any | null | undefined, key: string, fallbackValue: TEnum): TEnum {
		if (!raw) {
			return fallbackValue;
		}
		if (!(key in raw)) {
			return fallbackValue;
		}

		const value = raw[key];
		return value as TEnum; // 💩 enum と設定定義が全然ダメ
	}

	private static convertFilter(raw?: setting.IFilterSetting | null): IFilterConfiguration {
		if (!raw) {
			return {
				trim: true,
				whiteSpace: WhiteSpace.Join,
				lineBreak: LineBreak.Join,
			};
		}

		return {
			trim: type.getPrimaryPropertyOr(raw, 'trim', 'boolean', true),
			whiteSpace: SiteConfiguration.convertEnum(raw, 'whiteSpace', WhiteSpace.Join),
			lineBreak: SiteConfiguration.convertEnum(raw, 'lineBreak', LineBreak.Join),
		};
	}
	private static convertMatch(raw: setting.IMatchSetting): IMatchConfiguration | null {
		if (!type.hasPrimaryProperty(raw, 'pattern', 'boolean')) {
			return null;
		}

		return {
			ignoreCase: raw?.ignoreCase ?? true,
			mode: SiteConfiguration.convertEnum(raw, 'mode', MatchMode.Partial),
			pattern: raw.pattern || '',
		}
	}
	private static convertReplace(raw?: setting.IReplaceSetting | null): IReplaceConfiguration | null {
		if (!raw) {
			return null;
		}

		return {
			mode: SiteConfiguration.convertEnum(raw, 'mode', ReplaceMode.Normal),
			value: raw.value || '',
		};
	}

	private static convertTarget(raw?: setting.ITargetSetting | null): ITargetConfiguration | null {
		if (!raw) {
			return null;
		}

		const filter = SiteConfiguration.convertFilter(raw.filter);
		const match = raw.match ? SiteConfiguration.convertMatch(raw.match) : null;
		const replace = SiteConfiguration.convertReplace(raw.replace);

		if (!replace) {
			return null;
		}

		const result: ITargetConfiguration = {
			filter: filter,
			match: match,
			replace: replace,
		};
		return result;
	}

	public static convertPath(raw: setting.PathMap | null): PathMap {
		if (!raw) {
			return {};
		}

		const result: PathMap = {};

		if (typeof raw !== 'object') {
			return {};
		}

		for (const [path, pathSetting] of Object.entries(raw)) {
			if (common.isNullOrWhiteSpace(path)) {
				continue;
			}
			if (!pathSetting || typeof pathSetting !== 'object') {
				continue;
			}
			if (!('selector' in pathSetting) || !pathSetting.selector || typeof pathSetting.selector !== 'object') {
				continue;
			}

			const pathConfiguration: IPathConfiguration = {
				selector: {}
			};

			for (const [selector, querySetting] of Object.entries(pathSetting.selector)) {
				if (common.isNullOrWhiteSpace(selector)) {
					continue;
				}
				if (!querySetting) {
					continue;
				}

				const query: IQueryConfiguration = {
					attributes: {}
				};

				const text = SiteConfiguration.convertTarget(querySetting.text);
				if (text) {
					query.text = text;
				}

				const value = SiteConfiguration.convertTarget(querySetting.value);
				if (value) {
					query.value = value;
				}

				if (querySetting.attributes && typeof querySetting.attributes === 'object') {
					for (const [name, target] of Object.entries(querySetting.attributes)) {
						if (!common.isNullOrWhiteSpace(name)) {
							continue;
						}
						const attr = SiteConfiguration.convertTarget(target);
						if (attr) {
							query.attributes[name] = attr;
						}
					}
				}

				pathConfiguration.selector[selector] = query;
			}

			result[path] = pathConfiguration;
		}

		return result;
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

	public get lastCheckedTimestamp(): string {
		return this.head.lastCheckedTimestamp;
	}

	public get name(): string {
		return this.head.name;
	}

	public get version(): string {
		return this.head.version;
	}

	public get information(): ISiteInformationConfiguration {
		return this.head.information;
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
