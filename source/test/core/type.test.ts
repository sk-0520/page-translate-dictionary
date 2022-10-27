import * as type from '../../scripts/core/type';

describe('type', () => {
	test('hasPrimaryProperty', () => {
		expect(type.hasPrimaryProperty({}, 'a', 'number')).toBeFalsy();
		expect(type.hasPrimaryProperty({ a: undefined }, 'a', 'number')).toBeFalsy();
		expect(type.hasPrimaryProperty({ a: null }, 'a', 'number')).toBeFalsy();
		expect(type.hasPrimaryProperty({ a: 1 }, 'a', 'number')).toBeTruthy();
		expect(type.hasPrimaryProperty({ A: 1 }, 'a', 'number')).toBeFalsy();
		expect(type.hasPrimaryProperty({ a: '1' }, 'a', 'number')).toBeFalsy();
	});

	test('toBoolean', () => {
		expect(type.toBoolean(null)).toBeFalsy();
		expect(type.toBoolean(undefined)).toBeFalsy();
		expect(type.toBoolean("")).toBeFalsy();
		expect(type.toBoolean("t")).toBeFalsy();
		expect(type.toBoolean("f")).toBeFalsy();
		expect(type.toBoolean("false")).toBeFalsy();
		expect(type.toBoolean("FALSE")).toBeFalsy();
		expect(type.toBoolean("true")).toBeTruthy();
		expect(type.toBoolean("TRUE")).toBeTruthy();
	});

	test('toString', () => {
		expect(type.toString(null)).toBe('null');

		expect(type.toString(undefined)).toBe('undefined');

		expect(type.toString(false)).toBe('false');
		expect(type.toString(true)).toBe('true');

		expect(type.toString(1)).toBe('1');
	});
});
