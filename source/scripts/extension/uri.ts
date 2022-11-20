import Wildcard from "../core/wildcard";

export function isEnabledHosts(hostName: string, hostPatterns: ReadonlyArray<string>): boolean {
	for (const hostPattern of hostPatterns) {
		if (Wildcard.test(hostName, hostPattern)) {
			return true;
		}
	}

	return false;
}

