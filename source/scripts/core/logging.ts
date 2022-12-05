/**
 * 通常ログメソッド。
 */
export type LogMethod = (message?: any, ...optionalParams: any[]) => void;

/**
 * ログレベル。
 */
export enum LogLevel {
	Trace,
	Debug,
	Log,
	Information,
	Warning,
	Error,
}

export interface LogOptions {
	//#region property

	level: LogLevel;

	//#endregion

	//#region function


	//#endregion
}

export interface Logger {
	readonly level: LogLevel;
	readonly header: string;

	/** `LogLevel.Trace` 以上のログ出力処理 */
	trace: LogMethod;
	/** `LogLevel.Debug` 以上のログ出力処理 */
	debug: LogMethod;
	/** `LogLevel.Log` 以上のログ出力処理 */
	log: LogMethod;
	/** `LogLevel.Information` 以上のログ出力処理 */
	info: LogMethod;
	/** `LogLevel.Warning` 以上のログ出力処理 */
	warn: LogMethod;
	/** `LogLevel.Error` 以上のログ出力処理 */
	error: LogMethod;
}

export function nop(message?: any, ...optionalParams: any[]): void {
}

export function toMethod(currentLevel: LogLevel, targetLevel: LogLevel, method: LogMethod): LogMethod {
	return currentLevel <= targetLevel
		? method
		: nop
		;
}

export function create(header: string, options: LogOptions): Logger {
	return new ConsoleLogger(header, options);
}

class ConsoleLogger implements Logger {
	public constructor(public readonly header: string, private readonly options: LogOptions) {
		const logHeader = '[' + this.header + '] ';

		this.trace = toMethod(options.level, LogLevel.Trace, console.trace.bind(console, logHeader));
		this.debug = toMethod(options.level, LogLevel.Debug, console.debug.bind(console, logHeader));
		this.log = toMethod(options.level, LogLevel.Log, console.log.bind(console, logHeader));
		this.info = toMethod(options.level, LogLevel.Information, console.info.bind(console, logHeader));
		this.warn = toMethod(options.level, LogLevel.Warning, console.warn.bind(console, logHeader));
		this.error = toMethod(options.level, LogLevel.Error, console.error.bind(console, logHeader));
	}

	//#region property

	//#endregion

	//#region function
	//#endregion

	//#region Logger

	public get level(): LogLevel {
		return this.options.level;
	}

	trace: LogMethod;
	debug: LogMethod;
	log: LogMethod;
	info: LogMethod;
	warn: LogMethod;
	error: LogMethod;

	//#endregion
}
