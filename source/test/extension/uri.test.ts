import * as uri from '../../scripts/extension/uri';

describe('uri', () => {
	test.each([
		[true, 'localhost', ['localhost']],
		[true, 'www.localhost', ['*.localhost']],
		[true, 'localhost.com', ['localhost.*']],

		[true, 'localhost:1234', ['localhost:*']],

		[false, 'www.localhost', ['*.localhost.*']],
		[false, 'localhost.com', ['*.localhost.*']],

		[false, 'localhost:1234', ['localhost']],

		[true, 'localhost:1234', ['localhost', 'localhost:*']],
	])('isEnabledHosts', (expected: boolean, hostName: string, hostPatterns: string[]) => {
		expect(uri.isEnabledHosts(hostName, hostPatterns)).toBe(expected);
	});

	test.each([
		[true, '', ''],
		[true, 'a', ''],
		[true, 'a', 'a'],
		[false, 'a', 'b'],
		[true, 'abc', 'a'],
		[true, 'abc', 'b'],
		[true, 'abc', 'c'],
		[false, 'abc', 'd'],
	])('isEnabledPath', (expected: boolean, path: string, pathPattern: string) => {
		expect(uri.isEnabledPath(path, pathPattern)).toBe(expected);
	});
});
