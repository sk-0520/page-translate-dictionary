/**
 * 内部使用する(ある程度データが確定している)設定
 */
import * as setting from './setting';
import * as types from '../core/types';
import * as string from '../core/string';


export const enum SelectorMode {
	Normal,
	Common,
}

export const enum WhiteSpace {
	Join,
	Raw,
}

export const enum LineBreak {
	Join,
	Raw,
}

export const enum MetaContentMode {
	Partial,
	Forward,
	Backward,
	Perfect,
	Regex,
	NotEmpty,
	Ignore,
}

export const enum ReplaceMode {
	Normal,
	Common,
}

/**
 * 拡張機能内で識別するための設定ID。
 */
export type SiteInternalId = types.Strong<'SiteInternalId'>;

export function toInternalId(s: string): SiteInternalId {
	if (!s) {
		throw new Error();
	}

	return s as SiteInternalId;
}

/**
 * 各処理でどの設定を使用しているか表現するためのID。
 */
export interface SiteId {
	/** 設定データの一意キー(自動採番) */
	readonly id: SiteInternalId;
	/** 名前 */
	readonly name: string;
}

export interface InformationConfiguration {
	//#region property

	readonly websiteUrl: string;
	readonly repositoryUrl: string;
	readonly documentUrl: string;

	//#endregion
}

export interface FilterConfiguration {
	//#region property

	readonly lineBreak: LineBreak;
	readonly whiteSpace: WhiteSpace;
	readonly trim: boolean;

	//#endregion
}

export interface MatchConfiguration {
	//#region property

	readonly mode: string.MatchMode;
	readonly ignoreCase: boolean;
	readonly pattern: string;
	readonly replace: ReplaceConfiguration;

	//#endregion
}

export interface ReplaceConfiguration {
	//#region property

	readonly mode: ReplaceMode;
	readonly value: string;
	readonly regex: ReadonlyMap<string, ReadonlyMap<string, string>>;

	//#endregion
}

export interface TargetConfiguration {
	//#region property

	readonly filter: FilterConfiguration;
	readonly matches: ReadonlyArray<MatchConfiguration>;
	readonly replace: ReplaceConfiguration | null;

	//#endregion
}

export interface MetaConfiguration {
	//#region property

	readonly mode: MetaContentMode;
	readonly ignoreCase: boolean;
	readonly pattern: string;

	//#endregion
}

export interface SelectorConfiguration {
	//#region property

	readonly meta: ReadonlyMap<string, MetaConfiguration>;
	readonly mode: SelectorMode;
	readonly value: string;
	readonly node: number;
	readonly all: boolean;
	//[watch:omit] readonly watch: boolean;

	//#endregion
}

export interface QueryConfiguration {
	//#region property

	readonly selector: SelectorConfiguration;
	readonly text: TargetConfiguration | null;
	readonly attributes: ReadonlyMap<string, TargetConfiguration>;

	//#endregion
}

export interface PathConfiguration {
	//#region property

	readonly withSearch: boolean;

	readonly query: ReadonlyArray<QueryConfiguration>;

	readonly import: ReadonlyArray<string>;

	//#endregion
}

export interface WatchConfiguration {
	//#region property

	readonly window: ReadonlyArray<string>;

	readonly document: ReadonlyArray<string>;

	//#endregion
}

/**
 * 共通設定
 */
export interface CommonConfiguration {
	//#region property

	/** 共通セレクタ設定 */
	readonly selector: ReadonlyMap<string, string>;

	/** 共通テキスト設定 */
	readonly text: ReadonlyMap<string, string>;

	/** 共通クエリ設定 */
	readonly query: ReadonlyMap<string, QueryConfiguration>;

	//#endregion
}

export interface TranslateConfiguration {
	//#region property

	/**
	 * 置き換えた要素に対して視覚的マークを設定するか。
	 */
	markReplacedElement: boolean;

	//#endregion
}

export interface SettingConfiguration {
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

export interface ApplicationConfiguration {
	//#region property

	translate: TranslateConfiguration;
	setting: SettingConfiguration;

	//#endregion
}

export interface SiteHeadConfiguration extends SiteId {
	//#region property

	/** 設定ファイルのダウンロードURL */
	updateUrl: string,
	/** 設定ファイルの最終更新日 */
	updatedTimestamp: string,
	/** 設定ファイルの最終更新確認日 */
	lastCheckedTimestamp: string,
	/** 設定ファイルの有効無効状態 */
	isEnabled: boolean,

	/** バージョン */
	version: string;
	/** 対象ホスト */
	hosts: Array<string>;
	/** 設定情報 */
	information: InformationConfiguration;
	/** 優先度 */
	priority: number;
	/** 変換先言語 */
	language: string;

	//#endregion

	//#region ISite

	id: SiteInternalId,
	name: string;

	//#endregion
}

//TODO: 補正するのでプロパティの型はよくないはず(未調査)
export interface SiteBodyConfiguration {
	//#region property

	watch: setting.WatchSetting;

	path: setting.PathMap;

	common: setting.CommonSetting;

	//#endregion
}

//export type PathMap = { [path: string]: PathConfiguration };
export type PathMap = ReadonlyMap<RegExp, PathConfiguration>;

export interface SiteConfiguration extends SiteHeadConfiguration {
	//#region property

	watch: WatchConfiguration;

	path: PathMap;

	common: CommonConfiguration;

	//#endregion
}

export type SiteData = {
	readonly head: SiteHeadConfiguration,
	readonly body: SiteBodyConfiguration,
}

export function createSiteConfiguration(head: SiteHeadConfiguration, body: SiteBodyConfiguration): SiteConfiguration {
	return new SiteConfigurationImpl(head, body);
}

class SiteConfigurationImpl implements SiteConfiguration {

	public readonly watch: WatchConfiguration;
	public readonly path: PathMap;
	public readonly common: CommonConfiguration;

	public constructor(
		private readonly head: SiteHeadConfiguration,
		body: SiteBodyConfiguration
	) {
		// ここで全部のデータを補正
		this.watch = this.convertWatch(body.watch);
		this.path = this.convertPath(body.path);
		this.common = this.convertCommon(body.common);
	}

	//#region function

	private convertEnum<TEnum>(raw: any | null | undefined, key: string, fallbackValue: TEnum, map: Map<string, TEnum>): TEnum {
		if (!raw) {
			return fallbackValue;
		}
		if (!(key in raw)) {
			return fallbackValue;
		}

		const value = map.get(raw[key]);
		if (value) {
			return value;
		}

		return fallbackValue;
	}

	private convertWatch(raw?: setting.WatchSetting | null): WatchConfiguration {
		if (!raw) {
			return {
				window: [],
				document: [],
			};
		}

		function toStringArray(raw: setting.WatchSetting, key: keyof setting.WatchSetting) {
			const result = new Array<string>();
			if (types.hasArray(raw, key)) {
				const eventNames = raw[key]!;
				for (const eventName of eventNames) {
					if (types.isString(eventName) && string.isNotWhiteSpace(eventName)) {
						result.push(eventName);
					}
				}
			}
			return result;
		}

		const result: WatchConfiguration = {
			window: toStringArray(raw, 'window'),
			document: toStringArray(raw, 'document'),
		};

		return result;
	}

	private convertMetaCore(raw: setting.MetaSetting): MetaConfiguration {
		const result: MetaConfiguration = {
			mode: this.convertEnum(raw, 'mode', MetaContentMode.Partial, new Map([
				['partial', MetaContentMode.Partial],
				['forward', MetaContentMode.Forward],
				['backward', MetaContentMode.Backward],
				['perfect', MetaContentMode.Perfect],
				['regex', MetaContentMode.Regex],
				['not_empty', MetaContentMode.NotEmpty],
				['ignore', MetaContentMode.Ignore],
			])),
			ignoreCase: types.getPropertyOr(raw, 'ignore_case', true),
			pattern: types.getPropertyOr(raw, 'pattern', ''),
		};

		return result;
	}

	private convertMeta(raw: { [name: string]: setting.MetaSetting | null }): Map<string, MetaConfiguration> {
		const result = new Map<string, MetaConfiguration>();
		if (raw) {
			for (const [name, setting] of Object.entries(raw)) {
				if (setting) {
					const config = this.convertMetaCore(setting);
					if (config) {
						result.set(name, config);
					}
				}
			}
		}

		return result;
	}

	private convertSelector(raw: setting.SelectorSetting): SelectorConfiguration {
		const result: SelectorConfiguration = {
			meta: types.hasObject(raw, 'meta')
				? this.convertMeta(raw['meta']!)
				: new Map()
			,
			mode: this.convertEnum(raw, 'mode', SelectorMode.Normal, new Map([
				['normal', SelectorMode.Normal],
				['common', SelectorMode.Common],
			])),
			value: raw.value!,
			node: types.getPropertyOr(raw, 'node', 0),
			all: types.getPropertyOr(raw, 'all', false),
			//[watch:omit] watch: types.getPropertyOr(raw, 'watch', false),
		};

		return result;
	}

	private convertFilter(raw?: setting.FilterSetting | null): FilterConfiguration {
		if (!raw) {
			return {
				lineBreak: LineBreak.Join,
				whiteSpace: WhiteSpace.Join,
				trim: true,
			};
		}

		const result: FilterConfiguration = {
			lineBreak: this.convertEnum(raw, 'line_break', LineBreak.Join, new Map([
				['join', LineBreak.Join],
				['raw', LineBreak.Raw],
			])),
			whiteSpace: this.convertEnum(raw, 'white_space', WhiteSpace.Join, new Map([
				['join', WhiteSpace.Join],
				['raw', WhiteSpace.Raw],
			])),
			trim: types.getPropertyOr(raw, 'trim', true),
		};

		return result;
	}

	private convertMatch(raw: setting.MatchSetting): MatchConfiguration | null {
		if (!types.hasString(raw, 'pattern')) {
			return null;
		}
		if (!types.hasObject(raw, 'replace')) {
			return null;
		}

		const replace = this.convertReplace(raw.replace as Object);
		if (!replace) {
			return null;
		}

		const result: MatchConfiguration = {
			ignoreCase: types.getPropertyOr(raw, 'ignore_case', true),
			mode: this.convertEnum(raw, 'mode', string.MatchMode.Partial, new Map([
				['partial', string.MatchMode.Partial],
				['forward', string.MatchMode.Forward],
				['backward', string.MatchMode.Backward],
				['perfect', string.MatchMode.Perfect],
				['regex', string.MatchMode.Regex],
			])),
			pattern: raw.pattern!,
			replace: replace,
		};

		return result;
	}

	private convertMatches(raw?: ReadonlyArray<setting.MatchSetting> | null): Array<MatchConfiguration> {
		if (!raw) {
			return [];
		}

		const result = new Array<MatchConfiguration>();
		for (const item of raw) {
			const match = this.convertMatch(item);
			if (match) {
				result.push(match);
			}
		}

		return result;
	}

	private convertReplace(raw?: setting.ReplaceSetting | null): ReplaceConfiguration | null {
		if (!raw) {
			return null;
		}

		const regexMap = new Map<string, Map<string, string>>();
		if ('regex' in raw && raw.regex) {
			for (const [name, rawMap] of Object.entries(raw.regex)) {
				if (!rawMap) {
					continue;
				}

				const map = new Map<string, string>();
				for (const [key, value] of Object.entries(rawMap)) {
					if (value) {
						map.set(key, value);
					}
				}
				if (map.size) {
					regexMap.set(name, map);
				}
			}
		}

		const result: ReplaceConfiguration = {
			mode: this.convertEnum(raw, 'mode', ReplaceMode.Normal, new Map([
				['normal', ReplaceMode.Normal],
				['common', ReplaceMode.Common],
			])),
			value: raw.value || '',
			regex: regexMap,
		};

		return result;
	}

	private convertTarget(raw?: setting.TargetSetting | null): TargetConfiguration | null {
		if (!raw) {
			return null;
		}

		const filter = this.convertFilter(raw.filter);
		const matches = this.convertMatches(raw.matches);
		const replace = this.convertReplace(raw.replace);

		const result: TargetConfiguration = {
			filter: filter,
			matches: matches,
			replace: replace,
		};
		return result;
	}

	private convertQuery(raw: setting.QuerySetting | null): QueryConfiguration | null {
		if (!raw) {
			return null;
		}

		if (!raw.selector || !string.isNotWhiteSpace(raw.selector.value)) {
			return null;
		}

		const attributeMap = new Map<string, TargetConfiguration>();
		if (raw.attributes && typeof raw.attributes === 'object') {
			for (const [name, target] of Object.entries(raw.attributes)) {
				if (!string.isNotWhiteSpace(name)) {
					continue;
				}
				const attr = this.convertTarget(target);
				if (attr) {
					attributeMap.set(name, attr);
				}
			}
		}

		const query: QueryConfiguration = {
			selector: this.convertSelector(raw.selector),
			text: this.convertTarget(raw.text),
			attributes: attributeMap,
		};

		return query;
	}

	public convertPath(raw?: setting.PathMap | null): PathMap {
		if (!raw) {
			return new Map();
		}

		if (typeof raw !== 'object') {
			return new Map();
		}

		const result = new Map<RegExp, PathConfiguration>();

		//alert(JSON.stringify(raw));

		for (const key in raw) {
			let regKey: RegExp;
			try {
				regKey = new RegExp(key);
			} catch (ex) {
				console.error('path', key, ex);
				continue;
			}

			const pathSetting = raw[key];

			if (!string.isNotWhiteSpace(key)) {
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

			const queryItems = new Array<QueryConfiguration>();
			for (const querySetting of pathSetting.query) {
				const query = this.convertQuery(querySetting);
				if (!query) {
					continue;
				}

				queryItems.push(query);
			}

			let importItems = new Array<string>();
			if (types.hasArray(pathSetting, 'import')) {
				importItems = types.filterStringArray(pathSetting.import);
			}

			const pathConfiguration: PathConfiguration = {
				withSearch: types.getPropertyOr(pathSetting, 'with_search', false),
				query: queryItems,
				import: importItems,
			};

			result.set(regKey, pathConfiguration);
		}

		//alert('result -> ' + JSON.stringify(result))

		return result;
	}

	public convertCommon(raw?: setting.CommonSetting | null): CommonConfiguration {
		if (!raw) {
			return {
				selector: new Map(),
				text: new Map(),
				query: new Map(),
			};
		}

		const selectorMap = new Map<string, string>();
		if ('selector' in raw && raw.selector && typeof raw.selector === 'object') {
			for (const [key, selector] of Object.entries(raw.selector)) {
				if (string.isNotWhiteSpace(selector)) {
					selectorMap.set(key, selector!);
				}
			}
		}

		const textMap = new Map<string, string>();
		if ('text' in raw && raw.text && typeof raw.text === 'object') {
			for (const [key, text] of Object.entries(raw.text)) {
				if (string.isNotWhiteSpace(text)) {
					textMap.set(key, text!);
				}
			}
		}

		const queryMap = new Map<string, QueryConfiguration>();
		if ('query' in raw && raw.query && typeof raw.query === 'object') {
			for (const [key, querySetting] of Object.entries(raw.query)) {
				if (string.isNotWhiteSpace(key)) {
					const query = this.convertQuery(querySetting);
					if (query) {
						queryMap.set(key, query);
					}
				}
			}
		}

		const result: CommonConfiguration = {
			selector: selectorMap,
			text: textMap,
			query: queryMap,
		};

		return result;
	}

	public getHead(): Readonly<SiteHeadConfiguration> {
		return this.head;
	}

	//#endregion

	//#region SiteConfiguration

	public get id(): SiteInternalId {
		return this.head.id;
	}

	public get updateUrl(): string {
		return this.head.updateUrl;
	}

	public get updatedTimestamp(): string {
		return this.head.updatedTimestamp;
	}

	public get lastCheckedTimestamp(): string {
		return this.head.lastCheckedTimestamp;
	}

	public get isEnabled(): boolean {
		return this.head.isEnabled;
	}

	public get name(): string {
		return this.head.name;
	}

	public get version(): string {
		return this.head.version;
	}

	public get information(): InformationConfiguration {
		return this.head.information;
	}

	public get hosts(): Array<string> {
		return this.head.hosts;
	}

	public get priority(): number {
		return this.head.priority;
	}

	public get language(): string {
		return this.head.language;
	}

	//#endregion
}

// export interface BackgroundPageItem {
// 	tabId: number;
// }

// export interface BackgroundData {
// 	items: Array<BackgroundPageItem>;
// }
