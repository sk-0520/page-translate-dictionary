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
});
