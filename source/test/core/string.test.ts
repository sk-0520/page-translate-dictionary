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

	test('replaceAllImpl', () => {
		expect(string.replaceAllImpl('abcabcABCABC', 'a', '-')).toBe('-bc-bcABCABC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/, '-')).toBe('-bc-bcABCABC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/i, '-')).toBe('-bc-bc-BC-BC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/g, '-')).toBe('-bc-bcABCABC');
		expect(string.replaceAllImpl('abcabcABCABC', /a/gi, '-')).toBe('-bc-bc-BC-BC');
	})

	test('padding', () => {
		expect(string.padding(0, 2, ' ')).toBe(' 0');
		expect(string.padding(1, 2, ' ')).toBe(' 1');
		expect(string.padding(10, 2, ' ')).toBe('10');
		expect(string.padding(100, 2, ' ')).toBe('100');
		expect(string.padding(100, 4, ' ')).toBe(' 100');
		expect(string.padding(100, 4, '0')).toBe('0100');
		expect(string.padding(10, 4, '0')).toBe('0010');
		expect(string.padding(1, 4, '0')).toBe('0001');
		expect(() => string.padding(-1, 10, '0')).toThrow();
		expect(() => string.padding(1, 10, '00')).toThrow();
	});
});
