import * as string from '../../scripts/core/string';

describe('string', () => {
	test.each([
		[false, undefined],
		[false, null],
		[true, ''],
		[false, ' '],
		[false, 'a'],
	])('isEmpty', (expected: boolean, input: string | null | undefined) => {
		expect(string.isEmpty(input)).toBe(expected);
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
	});

	test('match', () => {
		const result = string.match('a', 'a', false, string.MatchMode.Forward);
		expect(result.isRegex).toBeFalsy();
		expect(result.matched).toBeTruthy();
	});
});

