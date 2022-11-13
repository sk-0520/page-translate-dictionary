// エラー系
// GEN: 2022-11-14T05:19:08+09:00

// 手動 ---------------------



// 自動 ---------------------

/**
* 未実装
 */
export class NotImplementedError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'NotImplementedError';
	}
}

/**
* 実装が存在しない
 */
export class NotSupportedError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'NotSupportedError';
	}
}

/**
* 不正処理
 */
export class InvalidOperationError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'InvalidOperationError';
	}
}

/**
* 引数異常
 */
export class ArgumentError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'ArgumentError';
	}
}

/**
* 指定要素の型が合わない
 */
export class ElementTypeError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'ElementTypeError';
	}
}

/**
* セレクタで要素が見つからない
 */
export class NotFoundDomSelectorError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'NotFoundDomSelectorError';
	}
}

