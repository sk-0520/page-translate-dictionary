
export function isEnabledHost(hostName: string, hostPattern: string): boolean {
	const regex = new RegExp(hostPattern);
	const result = regex.test(hostName);
	return result;
}

export function isEnabledPath(path: string, pathPattern: string): boolean {
	const regex = new RegExp(pathPattern);
	const result = regex.test(path);
	return result;
}
