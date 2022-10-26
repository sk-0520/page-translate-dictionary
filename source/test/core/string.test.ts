import * as string from '../../scripts/core/string';

describe('string', () => {
	test('isNullOrEmpty', () => {
		expect(string.isNullOrEmpty(undefined)).toBe(true);
		expect(string.isNullOrEmpty(null)).toBe(true);
		expect(string.isNullOrEmpty('')).toBe(true);
		expect(string.isNullOrEmpty(' ')).toBe(false);
		expect(string.isNullOrEmpty('a')).toBe(false);
	});

	test('isNullOrWhiteSpace', () => {
		expect(string.isNullOrWhiteSpace(undefined)).toBe(true);
		expect(string.isNullOrWhiteSpace(null)).toBe(true);
		expect(string.isNullOrWhiteSpace('')).toBe(true);
		expect(string.isNullOrWhiteSpace(' ')).toBe(true);
		expect(string.isNullOrWhiteSpace('a')).toBe(false);
		expect(string.isNullOrWhiteSpace("\r")).toBe(true);
		expect(string.isNullOrWhiteSpace("\n")).toBe(true);
		expect(string.isNullOrWhiteSpace("\r\n")).toBe(true);
		expect(string.isNullOrWhiteSpace(" \r\n \r\n ")).toBe(true);
	});

});
