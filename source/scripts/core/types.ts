type TypeOfPrimitive = 'string' | 'number' | 'bigint' | 'boolean';
//type TypeOfBuildIn = TypeOfPrimitive | 'symbol' | 'undefined' | 'object' | 'function';

export function isUndefined(arg: unknown): arg is undefined {
	return arg === undefined;
}

export function isNull(arg: unknown): arg is null {
	return arg === null;
}

export function isString(arg: unknown): arg is string {
	return arg !== undefined && arg !== null && typeof arg === 'string';
}

export function isNumber(arg: unknown): arg is number {
	return arg !== undefined && arg !== null && typeof arg === 'number';
}

export function isBigInt(arg: unknown): arg is bigint {
	return arg !== undefined && arg !== null && typeof arg === 'bigint';
}

export function isBoolean(arg: unknown): arg is boolean {
	return arg !== undefined && arg !== null && typeof arg === 'boolean';
}

export function isArray<T extends unknown>(arg: unknown): arg is Array<T> {
	return arg !== undefined && arg !== null && typeof arg === 'boolean';
}

export function hasProperty<K extends string | symbol>(obj: unknown, key: K): obj is Record<K, unknown> {
	return obj !== undefined && obj !== null && key in obj;
}

/**
 * @deprecated 細かいの使え
 */
export function hasPrimaryProperty(obj: unknown, key: string, type: TypeOfPrimitive): boolean {
	return hasProperty(obj, key) && typeof obj[key] === type;
}

export function hasStringProperty<K extends string | symbol>(obj: unknown, key: K): obj is Record<K, string> {
	return hasProperty(obj, key) && isString(obj[key]);
}

export function hasNumberProperty<K extends string | symbol>(obj: unknown, key: K): obj is Record<K, number> {
	return hasProperty(obj, key) && isNumber(obj[key]);
}

export function hasBigIntProperty<K extends string | symbol>(obj: unknown, key: K): obj is Record<K, bigint> {
	return hasProperty(obj, key) && isBigInt(obj[key]);
}

export function hasBooleanProperty<K extends string | symbol>(obj: unknown, key: K): obj is Record<K, boolean> {
	return hasProperty(obj, key) && isBoolean(obj[key]);
}

export function hasObjectProperty<K extends string | symbol>(obj: unknown, key: K): obj is Record<K, object> {
	return hasProperty(obj, key) && typeof obj[key] === 'object';
}

export function hasArrayProperty<T extends unknown, K extends string | symbol>(obj: unknown, key: K): obj is Record<K, Array<T>> {
	return hasProperty(obj, key) && Array.isArray(obj[key]);
}

export function getPrimaryPropertyOr<TResult>(obj: any, key: string, type: TypeOfPrimitive, fallbackValue: TResult): TResult {
	if (hasPrimaryProperty(obj, key, type)) {
		return obj[key] as TResult;
	}

	return fallbackValue;
}


export function toBoolean(s: string | null | undefined): boolean {
	if (!s) {
		return false;
	}

	return s.toLowerCase() === 'true';
}

export function toString(input: any): string {
	switch (typeof input) {
		case 'object':
			if (input === null) {
				return 'null';
			} else {
				break;
			}

		case 'undefined':
			return 'undefined';

		case 'boolean':
			return input ? 'true' : 'false';

		default:
			break;
	}

	return input + '';
}
