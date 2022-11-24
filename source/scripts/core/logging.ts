type LoggingMethod = (message?: any, ...optionalParams: any[]) => void;

export enum LogLevel {
	Trace,
	Debug,
	Log,
	Information,
	Warning,
	Error,
}

export interface Logger {
	trace: LoggingMethod;
	debug: LoggingMethod;
	log: LoggingMethod;
	info: LoggingMethod;
	warn: LoggingMethod;
	error: LoggingMethod;
}

export function create(header: string, level: LogLevel): Logger {
	return new LoggerImpl(header, level);
}

class LoggerImpl implements Logger {
	public constructor(private readonly header: string, private readonly level: LogLevel) {
		const logHeader = '[' + this.header + ']';

		this.trace = this.level <= LogLevel.Trace
			? console.trace.bind(console, logHeader)
			: LoggerImpl.nop
			;

		this.debug = this.level <= LogLevel.Debug
			? console.debug.bind(console, logHeader)
			: LoggerImpl.nop
			;

		this.log = this.level <= LogLevel.Log
			? console.log.bind(console, logHeader)
			: LoggerImpl.nop
			;

		this.info = this.level <= LogLevel.Information
			? console.info.bind(console, logHeader)
			: LoggerImpl.nop
			;

		this.warn = this.level <= LogLevel.Warning
			? console.warn.bind(console, logHeader)
			: LoggerImpl.nop
			;

		this.error = this.level <= LogLevel.Error
			? console.error.bind(console, logHeader)
			: LoggerImpl.nop
			;
	}

	//#region Logger

	private static nop(message?: any, ...optionalParams: any[]): void { }

	//#endregion

	//#region Logger

	trace: LoggingMethod;
	debug: LoggingMethod;
	log: LoggingMethod;
	info: LoggingMethod;
	warn: LoggingMethod;
	error: LoggingMethod;

	//#endregion
}
