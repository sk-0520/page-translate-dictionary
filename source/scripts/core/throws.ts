// エラー系



//----------------

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

