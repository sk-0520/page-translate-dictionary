//import webextension from "webextension-polyfill";

import * as logging from '../core/logging';


export function create(header: string): logging.Logger {
	const isProduction = true;

	return logging.create(
		header,
		isProduction
			? logging.LogLevel.Information
			: logging.LogLevel.Trace
	)
}
