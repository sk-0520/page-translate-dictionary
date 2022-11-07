type TypeOfPrimitive = 'string' | 'number' | 'bigint' | 'boolean';
//type TypeOfBuildIn = TypeOfPrimitive | 'symbol' | 'undefined' | 'object' | 'function';

export function hasProperty<K extends string | number | symbol>(obj: unknown, key: K): obj is Record<K, unknown> {
	return obj !== null && obj !== undefined && key in obj;
}

export function hasPrimaryProperty(obj: unknown, key: string, type: TypeOfPrimitive): boolean {
	return hasProperty(obj, key) && typeof obj[key] === type;
}

export function hasObjectProperty<K extends string | number | symbol>(obj: unknown, key: string): obj is Record<K, object> {
	return hasProperty(obj, key) && typeof obj[key] === 'object';
}

export function hasArrayProperty<K extends string | number | symbol>(obj: unknown, key: string): obj is Record<K, Array<unknown>> {
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
