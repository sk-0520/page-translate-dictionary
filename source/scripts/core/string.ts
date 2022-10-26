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

export function escapeRegex(source: string) {
	return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function padding(input: number, width: number, c: string): string {
	if (input < 0) {
		throw new Error('input is negative');
	}
	if (c.length != 1) {
		throw new Error('c.length is ' + c.length);
	}

	const numberValue = input.toString();


	// 埋める余地がない場合はそのまま返す
	if (width <= numberValue.length) {
		return numberValue;
	}
	const count = width - numberValue.length;
	const result = c.repeat(count) + numberValue;
	return result;
}
