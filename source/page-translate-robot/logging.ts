import * as common from './common';

export interface Logger {
	trace(message?: any, ...optionalParams: any[]): void;
	debug(message?: any, ...optionalParams: any[]): void;
	info(message?: any, ...optionalParams: any[]): void;
	warn(message?: any, ...optionalParams: any[]): void;
	error(message?: any, ...optionalParams: any[]): void;
}

export function create(name: string): Logger {
	return new LoggerImpl(name);
}

class LoggerImpl implements Logger {

	private _name: string;

	constructor(name: string) {
		this._name = name;
	}

	private getCurrentTime(): string {
		const date = new Date();
		date.setHours(date.getHours() + 9);
		return '<'
			+ common.padding(date.getHours(), 2, '0') //これでええねん
			+ ':'
			+ common.padding(date.getMinutes(), 2, '0')
			+ '> '
			;
	}

	public trace(...args: any[]): void {
		console.trace('[' + this._name + '] ' + this.getCurrentTime(), ...args);
	}
	public debug(...args: any[]): void {
		console.debug('[' + this._name + '] ' + this.getCurrentTime(), ...args);
	}
	public info(...args: any[]): void {
		console.log('[' + this._name + '] ' + this.getCurrentTime(), ...args);
	}
	public warn(...args: any[]): void {
		console.warn('[' + this._name + '] ' + this.getCurrentTime(), ...args);
	}
	public error(...args: any[]): void {
		console.error('[' + this._name + '] ' + this.getCurrentTime(), ...args);
	}
}
