
export function isEnabledHost(hostName: string, hostPattern: string): boolean {
	const regex = new RegExp(hostPattern);
	const result = regex.test(hostName);
	return result;
}
