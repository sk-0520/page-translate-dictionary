//import webextension from "webextension-polyfill";

import * as logging from '../core/logging';


export function create(header: string): logging.Logger {
	const isProduction = true;

	const options: logging.LogOptions = {
		level: isProduction
			? logging.LogLevel.Information
			: logging.LogLevel.Trace
		,
	};

	return logging.create(
		header,
		options
	)
}
