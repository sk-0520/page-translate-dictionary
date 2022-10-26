import Wildcard from "../core/wildcard";

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
