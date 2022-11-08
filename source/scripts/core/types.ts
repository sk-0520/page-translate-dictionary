type PropertyKey = string | symbol;

export function isUndefined(arg: unknown): arg is undefined {
	return typeof arg === 'undefined';
}

export function isNull(arg: unknown): arg is null {
	return arg === null;
}

export function isSymbol(arg: unknown): arg is string {
	return typeof arg === 'symbol';
}

export function isString(arg: unknown): arg is string {
	return typeof arg === 'string';
}

export function isNumber(arg: unknown): arg is number {
	return typeof arg === 'number';
}

export function isBigInt(arg: unknown): arg is bigint {
	return typeof arg === 'bigint';
}

export function isBoolean(arg: unknown): arg is boolean {
	return typeof arg === 'boolean';
}

export function isArray<T extends unknown>(arg: unknown): arg is Array<T> {
	return Array.isArray(arg);
}

export function isObject<T extends unknown>(arg: unknown): arg is Array<T> {
	return arg !== null && typeof arg === 'object' && !Array.isArray(arg);
}

export function isFunction<T extends Function>(arg: unknown): arg is T {
	return typeof arg === 'function';
}

export function hasProperty(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, unknown> {
	return obj !== undefined && obj !== null && key in obj;
}

export function hasUndefined(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, undefined> {
	return hasProperty(obj, key) && isUndefined(obj[key]);
}

export function hasNull(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, null> {
	return hasProperty(obj, key) && isNull(obj[key]);
}

export function hasSymbol(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, Symbol> {
	return hasProperty(obj, key) && isSymbol(obj[key]);
}

export function hasString(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, string> {
	return hasProperty(obj, key) && isString(obj[key]);
}

export function hasNumber(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, number> {
	return hasProperty(obj, key) && isNumber(obj[key]);
}

export function hasBigInt(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, bigint> {
	return hasProperty(obj, key) && isBigInt(obj[key]);
}

export function hasBoolean(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, boolean> {
	return hasProperty(obj, key) && isBoolean(obj[key]);
}

export function hasObject(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, object> {
	return hasProperty(obj, key) && isObject(obj[key]);
}

export function hasArray<T extends unknown>(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, Array<T>> {
	return hasProperty(obj, key) && isArray<T>(obj[key]);
}

export function hasFunction<T extends Function>(obj: unknown, key: PropertyKey): obj is Record<PropertyKey, T> {
	return hasProperty(obj, key) && isFunction<T>(obj[key]);
}

export function getPropertyOr<TResult>(obj: unknown, key: string, fallbackValue: TResult): TResult {
	if (hasProperty(obj, key)) {
		if (typeof fallbackValue === typeof obj[key]) {
			return obj[key] as TResult;
		}
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
