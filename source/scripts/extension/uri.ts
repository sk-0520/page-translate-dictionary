import Wildcard from "../core/wildcard";

function isProtocolUrl(url: string, protocols: ReadonlyArray<string>): boolean {
	const starts = protocols.map(i => i + '://');

	for (const start of starts) {
		if (url.startsWith(start) && start.length < url.length) {
			return true;
		}
	}

	return false;
}

export function isHttpUrl(s: string): boolean {
	return isProtocolUrl(s, [
		'https',
		'http',
	]);
}

export function isUserUrl(s: string): boolean {
	return isProtocolUrl(s, [
		'https',
		'http',
		'file',
	]);
}

export function isEnabledHosts(hostName: string, hostPatterns: string[]): boolean {
	for (const hostPattern of hostPatterns) {
		if (Wildcard.test(hostName, hostPattern)) {
			return true;
		}
	}

	return false;
}

export function isEnabledPath(path: string, pathPattern: string): boolean {
	const regex = new RegExp(pathPattern);
	const result = regex.test(path);
	return result;
}
