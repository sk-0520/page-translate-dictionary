/**
 * 内部使用する(ある程度データが確定している)設定
 */
import * as setting from './setting';
import * as type from '../core/type';
import * as string from '../core/string';

/**
 * 拡張機能内で識別するための設定ID。
 */
export type SiteInternalId = string;

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

export const enum MatchMode {
	Partial,
	Forward,
	Backward,
	Perfect,
	Regex,
}

export const enum ReplaceMode {
	Normal,
	Common,
}

export interface FilterConfiguration {
	//#region property

	readonly trim: boolean;
	readonly whiteSpace: WhiteSpace;
	readonly lineBreak: LineBreak;

	//#endregion
}

export interface MatchConfiguration {
	//#region property

	readonly mode: MatchMode;
	readonly ignoreCase: boolean;
	readonly pattern: string;
	readonly replace: ReplaceConfiguration;

	//#endregion
}

export interface ReplaceConfiguration {
	//#region property

	readonly mode: ReplaceMode;
	readonly value: string;

	//#endregion
}

export interface TargetConfiguration {
	//#region property

	readonly filter: FilterConfiguration;
	readonly matches: ReadonlyArray<MatchConfiguration>;
	readonly replace: ReplaceConfiguration | null;

	//#endregion
}

export interface SelectorConfiguration {
	//#region property

	readonly mode: SelectorMode;
	readonly value: string;
	readonly node: number;
	readonly all: boolean;

	//#endregion
}

export interface QueryConfiguration {
	//#region property

	readonly selector: SelectorConfiguration;
	readonly text: TargetConfiguration | null;
	readonly value: TargetConfiguration | null;
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

	/** バージョン */
	version: string;
	/** 対象ホスト */
	hosts: string[];
	/** 設定情報 */
	information: InformationConfiguration;
	/** 優先度 */
	level: number;
	/** 変換先言語 */
	language: string;

	//#endregion

	//#region ISite

	id: SiteInternalId,
	name: string;

	//#endregion
}

export interface SiteBodyConfiguration {
	//#region property

	path: setting.PathMap;

	common: setting.CommonSetting;

	//#endregion
}

export type PathMap = { [path: string]: PathConfiguration };

export interface SiteConfiguration extends SiteHeadConfiguration {
	//#region property

	path: PathMap;

	common: CommonConfiguration;

	//#endregion
}

export type SiteData = {
	readonly head: SiteHeadConfiguration,
	readonly body: SiteBodyConfiguration,
}

export class SiteConfigurationImpl implements SiteConfiguration {

	public readonly path: PathMap;
	public readonly common: CommonConfiguration;

	public constructor(
		private readonly head: SiteHeadConfiguration,
		body: SiteBodyConfiguration
	) {
		// ここで全部のデータを補正
		//alert('body.path = ' + JSON.stringify(body.path));
		this.path = this.convertPath(body.path || null);
		//alert('this.path = ' + JSON.stringify(this.path));
		this.common = this.convertCommon(body.common || null);
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

	private convertSelector(raw: setting.SelectorSetting): SelectorConfiguration {
		const result: SelectorConfiguration = {
			mode: this.convertEnum(raw, 'mode', SelectorMode.Normal, new Map([
				['normal', SelectorMode.Normal],
				['common', SelectorMode.Common],
			])),
			value: raw.value!,
			node: type.getPrimaryPropertyOr(raw, 'node', 'number', 0),
			all: type.getPrimaryPropertyOr(raw, 'all', 'boolean', false),
		};

		return result;
	}
	private convertFilter(raw?: setting.FilterSetting | null): FilterConfiguration {
		if (!raw) {
			return {
				trim: true,
				whiteSpace: WhiteSpace.Join,
				lineBreak: LineBreak.Join,
			};
		}

		const result: FilterConfiguration = {
			trim: type.getPrimaryPropertyOr(raw, 'trim', 'boolean', true),
			whiteSpace: this.convertEnum(raw, 'whiteSpace', WhiteSpace.Join, new Map([
				['join', WhiteSpace.Join],
				['raw', WhiteSpace.Raw],
			])),
			lineBreak: this.convertEnum(raw, 'lineBreak', LineBreak.Join, new Map([
				['join', LineBreak.Join],
				['raw', LineBreak.Raw],
			])),
		};

		return result;
	}

	private convertMatch(raw: setting.MatchSetting): MatchConfiguration | null {
		if (!type.hasPrimaryProperty(raw, 'pattern', 'string')) {
			return null;
		}
		if (string.isNullOrEmpty(raw.pattern)) {
			return null;
		}

		const replace = this.convertReplace(raw.replace);
		if (!replace) {
			return null;
		}

		const result: MatchConfiguration = {
			ignoreCase: type.getPrimaryPropertyOr(raw, 'ignoreCase', 'boolean', true),
			mode: this.convertEnum(raw, 'mode', MatchMode.Partial, new Map([
				['partial', MatchMode.Partial],
				['forward', MatchMode.Forward],
				['backward', MatchMode.Backward],
				['perfect', MatchMode.Perfect],
				['regex', MatchMode.Regex],
			])),
			pattern: raw.pattern!,
			replace: replace,
		};

		return result;
	}

	private convertMatches(raw?: ReadonlyArray<setting.MatchSetting> | null): MatchConfiguration[] {
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

		return {
			mode: this.convertEnum(raw, 'mode', ReplaceMode.Normal, new Map([
				['normal', ReplaceMode.Normal],
				['common', ReplaceMode.Common],
			])),
			value: raw.value || '',
		};
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

		if (!raw.selector || string.isNullOrWhiteSpace(raw.selector.value)) {
			return null;
		}

		const attributeMap = new Map<string,TargetConfiguration>();
		if (raw.attributes && typeof raw.attributes === 'object') {
			for (const [name, target] of Object.entries(raw.attributes)) {
				if (string.isNullOrWhiteSpace(name)) {
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
			value: this.convertTarget(raw.value),
			attributes: attributeMap,
		};

		return query;
	}

	public convertPath(raw: setting.PathMap | null): PathMap {
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

			if (string.isNullOrWhiteSpace(key)) {
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

			const importItems = new Array<string>();
			if (type.hasArrayProperty(pathSetting, 'import')) {
				for (const name of pathSetting.import!) { //TODO: !
					if (typeof name !== 'string') {
						continue;
					}

					importItems.push(name);
				}
			}

			const pathConfiguration: PathConfiguration = {
				withSearch: type.getPrimaryPropertyOr(pathSetting, 'withSearch', 'boolean', false),
				query: queryItems,
				import: importItems,
			};

			result[key] = pathConfiguration;
		}

		//alert('result -> ' + JSON.stringify(result))

		return result;
	}

	public convertCommon(raw: setting.CommonSetting | null): CommonConfiguration {
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
				if (!string.isNullOrWhiteSpace(selector)) {
					selectorMap.set(key, selector!);
				}
			}
		}

		const textMap = new Map<string, string>();
		if ('text' in raw && raw.text && typeof raw.text === 'object') {
			for (const [key, text] of Object.entries(raw.text)) {
				if (!string.isNullOrWhiteSpace(text)) {
					textMap.set(key, text!);
				}
			}
		}

		const queryMap = new Map<string, QueryConfiguration>();
		if ('query' in raw && raw.query && typeof raw.query === 'object') {
			for (const [key, querySetting] of Object.entries(raw.query)) {
				if (!string.isNullOrWhiteSpace(key)) {
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

	public get information(): InformationConfiguration {
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
