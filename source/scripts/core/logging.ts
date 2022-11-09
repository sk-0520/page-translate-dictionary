export interface Logger {
	log: (arg: any) => void
}

export function create(header: string): Logger {
	return new LoggerImpl(header);
}

class LoggerImpl implements Logger {
	public constructor(header: string) {
		this.log = console.log.bind(console, header);
	}

	//#region Logger

	log: (arg: any) => void;

	//#endregion
}
