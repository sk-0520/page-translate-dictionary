// エラー系
// GEN: 2022-11-12T22:41:39+09:00

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

