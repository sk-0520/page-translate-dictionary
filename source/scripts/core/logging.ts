type LoggingMethod = (message?: any, ...optionalParams: any[]) => void;

export interface Logger {
	trace: LoggingMethod;
	log: LoggingMethod;
	debug: LoggingMethod;
	info: LoggingMethod;
	warn: LoggingMethod;
	error: LoggingMethod;
}

export function create(header: string): Logger {
	return new LoggerImpl(header);
}

class LoggerImpl implements Logger {
	public constructor(private header: string) {
		const logHeader = '[' + this.header + ']';

		if(console.trace) {
			this.trace = console.trace.bind(console, logHeader);
		} else {
			this.trace = (message?: any, ...optionalParams: any[]) => {};
		}
		this.log = console.log.bind(console, logHeader);
		this.debug = console.debug.bind(console, logHeader);
		this.info = console.info.bind(console, logHeader);
		this.warn = console.warn.bind(console, logHeader);
		this.error = console.error.bind(console, logHeader);
	}

	//#region Logger

	trace: LoggingMethod;
	log: LoggingMethod;
	debug: LoggingMethod;
	info: LoggingMethod;
	warn: LoggingMethod;
	error: LoggingMethod;

	//#endregion
}
