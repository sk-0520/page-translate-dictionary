type TypeOfType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export function hasProperty(obj: any, key: string): boolean {
	if (!obj) {
		return false;
	}
	if (!(key in obj)) {
		return false;
	}

	return true;
}

export function hasPrimaryProperty(obj: any, key: string, type: TypeOfType): boolean {
	return hasProperty(obj, key) && typeof obj[key] === type;
}

export function hasObjectProperty(obj: any, key: string): boolean {
	return hasPrimaryProperty(obj, key, 'object') && obj[key]
}

export function hasArrayProperty(obj: any, key: string): boolean {
	return hasProperty(obj, key) && Array.isArray(obj[key]);
}

export function getPrimaryPropertyOr<TResult>(obj: any, key: string, type: TypeOfType, fallbackValue: TResult): TResult {
	if (hasPrimaryProperty(obj, key, type)) {
		return obj[key] as TResult;
	}

	return fallbackValue;
}
