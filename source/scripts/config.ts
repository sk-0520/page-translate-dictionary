/**
 * 内部使用する(ある程度データが確定している)設定
 */
import * as setting from './setting';
import * as type from './type';
import * as common from './common';

export type SiteConfigurationId = string;

export interface ISiteInformationConfiguration {
	//#region property

	websiteUrl: string;
	repositoryUrl: string;
	documentUrl: string;

	//#endregion
}

export const enum SelectorMode {
	Normal = 'normal',
	Common = 'common',
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

export interface ISelectorConfiguration {
	//#region property

	mode: SelectorMode;
	value: string;
	node: number;

	//#endregion
}

export interface IQueryConfiguration {
	//#region property

	selector: ISelectorConfiguration;
	text?: ITargetConfiguration;
	value?: ITargetConfiguration;
	attributes: { [name: string]: ITargetConfiguration };

	//#endregion
}

export interface IPathConfiguration {
	//#region property

	query: IQueryConfiguration[];

	import: string[];

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

	/** 共通クエリ設定 */
	query: { [key: string]: IQueryConfiguration }

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
	 * 設定のアップデート処理を翻訳前に実施するか。
	 *
	 * 対象サーバーが落ちている・見つからない場合に翻訳まで時間がかかるため原則 `false` となる。
	 * 想定する使用は検証時(`periodDays = 0` と組み合わせてローカルサーバーから設定を取得する感じ)。
	 */
	updatedBeforeTranslation: boolean;


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

	public readonly path: PathMap;
	public readonly common: ICommonConfiguration;

	public constructor(
		private readonly head: ISiteHeadConfiguration,
		body: ISiteBodyConfiguration
	) {
		// ここで全部のデータを補正
		//alert('body.path = ' + JSON.stringify(body.path));
		this.path = SiteConfiguration.convertPath(body.path || null);
		//alert('this.path = ' + JSON.stringify(this.path));
		this.common = SiteConfiguration.convertCommon(body.common || null);
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

	private static convertSelector(raw: setting.ISelectorSetting): ISelectorConfiguration {
		return {
			mode: SiteConfiguration.convertEnum(raw, 'mode', SelectorMode.Normal),
			value: raw.value!,
			node: type.getPrimaryPropertyOr(raw, 'node', 'number', 0),
		};
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

	private static convertQuery(raw: setting.IQuerySetting | null): IQueryConfiguration | null {
		if (!raw) {
			return null;
		}

		if (!raw.selector || common.isNullOrWhiteSpace(raw.selector.value)) {
			return null;
		}

		const query: IQueryConfiguration = {
			selector: SiteConfiguration.convertSelector(raw.selector),
			attributes: {},
		};

		const text = SiteConfiguration.convertTarget(raw.text);
		if (text) {
			query.text = text;
		}

		const value = SiteConfiguration.convertTarget(raw.value);
		if (value) {
			query.value = value;
		}

		if (raw.attributes && typeof raw.attributes === 'object') {
			for (const [name, target] of Object.entries(raw.attributes)) {
				if (common.isNullOrWhiteSpace(name)) {
					continue;
				}
				const attr = SiteConfiguration.convertTarget(target);
				if (attr) {
					query.attributes[name] = attr;
				}
			}
		}

		return query;
	}

	public static convertPath(raw: setting.PathMap | null): PathMap {
		if (!raw) {
			return {};
		}

		const result: PathMap = {};

		if (typeof raw !== 'object') {
			return {};
		}

		//alert(JSON.stringify(raw));

		for (const key in raw) {
			const pathSetting = raw[key];

			if (common.isNullOrWhiteSpace(key)) {
				// alert('0:::::' + key)
				continue;
			}
			if (!pathSetting || typeof pathSetting !== 'object') {
				// alert('1:::::' + key)
				continue;
			}
			if (!('query' in pathSetting) || !pathSetting.query || !Array.isArray(pathSetting.query)) {
				// alert('2:::::' + key)
				continue;
			}
			// alert('3:::::' + key)

			const pathConfiguration: IPathConfiguration = {
				query: [],
				import: [],
			};

			for (const querySetting of pathSetting.query) {
				const query = SiteConfiguration.convertQuery(querySetting);
				if (!query) {
					continue;
				}

				pathConfiguration.query.push(query);
			}

			if (type.hasArrayProperty(pathSetting, 'import')) {
				for (const name of pathSetting.import!) { //TODO: !
					if (typeof name !== 'string') {
						continue;
					}

					pathConfiguration.import.push(name);
				}
			}

			result[key] = pathConfiguration;
		}

		//alert('result -> ' + JSON.stringify(result))

		return result;
	}

	public static convertCommon(raw: setting.ICommonSetting | null): ICommonConfiguration {
		if (!raw) {
			return {
				selector: {},
				text: {},
				query: {},
			};
		}

		const result: ICommonConfiguration = {
			selector: {},
			text: {},
			query: {},
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

		if ('query' in raw && raw.query && typeof raw.query === 'object') {
			for (const [key, querySetting] of Object.entries(raw.query)) {
				if (!common.isNullOrWhiteSpace(key)) {
					const query = SiteConfiguration.convertQuery(querySetting);
					if (query) {
						result.query[key] = query!;
					}
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

	//#endregion
}
