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

	test.each([
		[false, undefined],
		[false, null],
		[false, ''],
		[false, ' '],
		[true, 'a'],
	])('isNotEmpty', (expected: boolean, input: string | null | undefined) => {
		expect(string.isNotEmpty(input)).toBe(expected);
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

	test.each([
		[true, 'abc', 'a', false],
		[true, 'abc', 'b', false],
		[true, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[true, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Partial', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Partial);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[true, 'abc', 'a', false],
		[false, 'abc', 'b', false],
		[false, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[true, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Forward', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Forward);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[false, 'abc', 'a', false],
		[false, 'abc', 'b', false],
		[true, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[false, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Backward', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Backward);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[false, 'abc', 'a', false],
		[false, 'abc', 'b', false],
		[false, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[false, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
	])('match:Perfect', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Perfect);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBeFalsy();
	});

	test.each([
		[true, 'abc', 'a', false],
		[true, 'abc', 'b', false],
		[true, 'abc', 'c', false],
		[false, 'abc', 'A', false],
		[true, 'abc', 'A', true],
		[true, 'abc', 'abc', false],
		[false, 'abc', 'abcd', false],
		[true, 'abc', '...', false],
		[false, 'abc', '....', false],
	])('match:Regex', (expected: boolean, input: string, pattern: string, ignoreCase: boolean) => {
		const actual = string.match(input, pattern, ignoreCase, string.MatchMode.Regex);
		expect(actual.matched).toBe(expected);
		expect(actual.isRegex).toBe(expected);
	});
});

