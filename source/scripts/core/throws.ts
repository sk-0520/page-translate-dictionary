// エラー系

export class NotImplementedError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'NotImplementedError';
	}
}

export class InvalidOperationError extends Error {
	constructor(message?: string | undefined) {
		super(message);
		this.name = 'InvalidOperationError';
	}
}

