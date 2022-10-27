import Wildcard from "../core/wildcard";

export function isHttpUrl(s: string): boolean {
	const starts = [
		'https://',
		'http://',
	];
	for(const start of starts) {
		if(s.startsWith(start) && start.length < s.length) {
			return true;
		}
	}

	return false;
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
