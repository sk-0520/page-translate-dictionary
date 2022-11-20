/**
 *  ユーザー(サイト翻訳機能提供者)があれこれやるやつ
 *
 * このファイルを一枚コピペで取り込めば別プロジェクトでも ts で扱えるようにするため外部依存はしない方針。
 * 一応このファイルからスキーマつくれたよ。
 */

/**
 * 設定情報。
 */
export interface InformationSetting {
	//#region property

	/** 作者サイト */
	website?: string | null;
	/** リポジトリ */
	repository?: string | null;
	/** 設定に関する説明 */
	document?: string | null;

	//#endregion
}

/**
 * フィルタリング設定。
 */
export interface FilterSetting {
	//#region property

	/**
	 * テキストの改行の扱い。
	 *
	 * * `join`: 半角スペース1つに置き換える
	 * * `raw`: そのまま
	 */
	line_break?: 'join' | 'raw' | null;
	/**
	 * ホワイトスペース(注意: 改行は含まない)の扱い。
	 *
	 * * `join`: 半角スペース1つに置き換える
	 * * `raw`: そのまま
	 */
	white_space?: 'join' | 'raw' | null;
	/**
	 * トリムを実施するか。
	 */
	trim?: boolean;

	//#endregion
}

/**
 * 一致設定。
 */
export interface MatchSetting {
	//#region property

	/**
	 * パターンの扱い。
	 *
	 * * `partial`: 部分一致
	 * * `forward`: 前方一致
	 * * `backward`: 後方一致
	 * * `perfect`: 完全一致
	 * * `regex`: 正規表現
	 */
	mode?: 'partial' | 'forward' | 'backward' | 'perfect' | 'regex'| null;
	/**
	 * 大文字小文字を無視するか。
	 */
	ignore_case?: boolean | null;
	/**
	 * パターン。
	 */
	pattern?: string | null;
	/**
	 * 置き換え処理。
	 */
	replace?: ReplaceSetting | null;

	//#endregion
}

/**
 * 置き換え設定。
 */
export interface ReplaceSetting {
	//#region property

	/**
	 * 置き換え方法。
	 *
	 * * `normal`: 通常
	 * * `common`: 共通テキストから割り当て
	 */
	mode?: 'normal' | 'common' | null;
	/**
	 * 置き換え値。
	 *
	 * * 置き換え方法が共通の場合、該当する共通テキストを設定。
	 * * 条件が正規表現の場合で指定がある場合 `(?<NAME>)` を `$<NAME>` で使用可能。
	 */
	value?: string | null;

	/**
	 * 正規表現による置き換え値。
	 *
	 * 条件が正規表現の場合にキャプチャグループ名に対する置き換え文字列を指定(未指定・一致しない場合にもと文字列)
	 */
	regex?: { [name: string]: { [key: string]: string | null } } | null;

	//#endregion
}

/**
 * 対象要素(のテキスト・属性それぞれ)に対する設定。
 */
export interface TargetSetting {
	//#region property

	/** フィルタリング */
	filter?: FilterSetting | null;
	/** 一致条件一覧 */
	matches?: Array<MatchSetting> | null;
	/**
	 * 置き換え設定。
	 *
	 * 一致条件一覧に合致しなければこれが使用される。
	 */
	replace?: ReplaceSetting | null;

	//#endregion
}

/**
 * `<meta>` に対する条件設定。
 */
export interface MetaSetting {
	//#region property

	/**
	 * パターンの扱い。
	 *
	 * * `partial`: 部分一致
	 * * `forward`: 前方一致
	 * * `backward`: 後方一致
	 * * `perfect`: 完全一致
	 * * `regex`: 正規表現
	 * * `ignore` パターンは無視する
	 * * `not_empty`: ホワイトスペース以外が含めれている
	 */
	mode?: 'partial' | 'forward' | 'backward' | 'perfect' | 'regex' | 'ignore'  | 'not_empty' | 'ignore' | null;
	/**
	 * 大文字小文字を無視するか。
	 */
	ignore_case?: boolean | null;
	/**
	 * パターン。
	 *
	 * `mode` に対して `ignore` を指定した場合、 `SelectorSetting` の名前に合致しているため条件を真とし、本パターン自体は使用しない。
	 */
	pattern?: string | null;

	//#endregion
}

/**
 * セレクタ設定。
 */
export interface SelectorSetting {
	//#region property

	/**
	 * 該当する meta データに合致する場合セレクタを有効にする。
	 *
	 * * プロパティ名が `meta[name]` に該当
	 *
	 * 正しいかはともかくログイン済みかどうかなどの情報が `meta` に含まれている気がするので(おれ調べ)。
	 * AND 条件となるので程々の使用にとどめるべき。
	 */
	meta?: { [name: string]: MetaSetting | null } | null;

	/**
	 * セレクタ種別
	 *
	 * * `normal`: 通常
	 * * `common`: 共通セレクタから割り当て
	 */
	mode?: 'normal' | 'common' | null;
	/**
	 * セレクタ。
	 *
	 * * セレクタ種別が共通の場合、該当する共通セレクタを設定。
	 */
	value: string | null;

	/**
	 * テキストノード指定。
	 *
	 * `Element.childNodes` の `Text` だけを集計した 1 基底の番号: `<span>[1]<br />[2]<br />[3]</span>`
	 *
	 * 負数を指定した場合は全テキストノードが対象となる(matchesによる制御を想定)
	 *
	 * `-1`: 一致時点で後続終了
	 * `-2`: すべて処理。
	 */
	node?: number | null;
	/**
	 * セレクタを全要素に適用するか
	 */
	all?: boolean | null;
	//[watch:omit] /**
	//[watch:omit]  * 対象用を監視対象とするか
	//[watch:omit]  */
	//[watch:omit] watch?: boolean | null;

	//#endregion
}

/**
 * クエリ設定。
 */
export interface QuerySetting {
	//#region property

	/**
	 * セレクタ。
	 */
	selector?: SelectorSetting | null;
	/**
	 * テキスト置き換え設定。
	 */
	text?: TargetSetting | null;
	/**
	 * 属性置き換え設定。
	 */
	attributes?: { [name: string]: TargetSetting | null; } | null;

	//#endregion
}

/**
 * パス設定。
 */
export interface PathSetting {
	//#region property

	/**
	 * パスにクエリ部分を含めるか
	 */
	with_search?: boolean | null;

	/**
	 * クエリ一覧。
	 */
	query?: Array<QuerySetting> | null;

	/**
	 * 取り込み共通セレクタ。
	 */
	import?: Array<string> | null;

	//#endregion
}

/**
 * 監視設定。
 */
export interface WatchSetting {
	//#region property

	/** `window` に対する更新検知対象のイベント名 */
	window?: Array<string> | null;

	/** `document` に対する更新検知対象のイベント名 */
	document?: Array<string> | null;

	//#endregion
}

/**
 * 共通設定。
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
	hosts: Array<string>;
	/** 設定情報 */
	information?: InformationSetting | null;
	/**
	 * 優先度
	 *
	 * * 通常: 0
	 * * 低 < 0 < 高
	 */
	priority?: number | null;
	/** 変換先言語 */
	language?: string | null;

	/** 監視設定 */
	watch?: WatchSetting | null;

	/** パスに対する変換設定 */
	path?: PathMap | null;

	/** 変換共通処理 */
	common?: CommonSetting | null;

	//#endregion
}
