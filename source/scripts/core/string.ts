export function isNullOrEmpty(s?: string | null): boolean {
	if (!s) {
		return true;
	}
	return s.length === 0;
}

export function isNullOrWhiteSpace(s?: string | null): boolean {
	if (!s) {
		return true;
	}
	return s.trim().length === 0;
}
