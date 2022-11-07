import * as types from '../../scripts/core/types';

describe('types', () => {
	test('hasProperty', () => {
		const a1 = {
			a: 1,
			b: 'B',
		};
		expect(types.hasProperty(a1, 'a')).toBeTruthy();
		expect(types.hasProperty(a1, 'b')).toBeTruthy();
		expect(types.hasProperty(a1, 'c')).toBeFalsy();
	});

	test('hasPrimaryProperty', () => {
		expect(types.hasPrimaryProperty({}, 'a', 'number')).toBeFalsy();
		expect(types.hasPrimaryProperty({ a: undefined }, 'a', 'number')).toBeFalsy();
		expect(types.hasPrimaryProperty({ a: null }, 'a', 'number')).toBeFalsy();
		expect(types.hasPrimaryProperty({ a: 1 }, 'a', 'number')).toBeTruthy();
		expect(types.hasPrimaryProperty({ A: 1 }, 'a', 'number')).toBeFalsy();
		expect(types.hasPrimaryProperty({ a: '1' }, 'a', 'number')).toBeFalsy();

		const a1: unknown = {
			a: 1,
			b: 'B',
		};
		expect(types.hasPrimaryProperty(a1, 'a', 'number')).toBeTruthy();
	});

	test('toBoolean', () => {
		expect(types.toBoolean(null)).toBeFalsy();
		expect(types.toBoolean(undefined)).toBeFalsy();
		expect(types.toBoolean("")).toBeFalsy();
		expect(types.toBoolean("t")).toBeFalsy();
		expect(types.toBoolean("f")).toBeFalsy();
		expect(types.toBoolean("false")).toBeFalsy();
		expect(types.toBoolean("FALSE")).toBeFalsy();
		expect(types.toBoolean("true")).toBeTruthy();
		expect(types.toBoolean("TRUE")).toBeTruthy();
	});

	test('toString', () => {
		expect(types.toString(null)).toBe('null');

		expect(types.toString(undefined)).toBe('undefined');

		expect(types.toString(false)).toBe('false');
		expect(types.toString(true)).toBe('true');

		expect(types.toString(1)).toBe('1');
	});
});
