import * as uri from '../../scripts/extension/uri';

describe('uri', () => {
	test('isHttpUrl', () => {
		expect(uri.isHttpUrl('')).toBeFalsy();
		expect(uri.isHttpUrl(' http:// ')).toBeFalsy();

		expect(uri.isHttpUrl('http')).toBeFalsy();
		expect(uri.isHttpUrl('http:')).toBeFalsy();
		expect(uri.isHttpUrl('http:/')).toBeFalsy();
		expect(uri.isHttpUrl('http://')).toBeFalsy();
		expect(uri.isHttpUrl('http://x')).toBeTruthy();

		expect(uri.isHttpUrl('https')).toBeFalsy();
		expect(uri.isHttpUrl('https:')).toBeFalsy();
		expect(uri.isHttpUrl('https:/')).toBeFalsy();
		expect(uri.isHttpUrl('https://')).toBeFalsy();
		expect(uri.isHttpUrl('https://x')).toBeTruthy();
	});

	test('isEnabledHosts', () => {
		expect(uri.isEnabledHosts('localhost', ['localhost'])).toBeTruthy();
		expect(uri.isEnabledHosts('www.localhost', ['*.localhost'])).toBeTruthy();
		expect(uri.isEnabledHosts('localhost.com', ['localhost.*'])).toBeTruthy();

		expect(uri.isEnabledHosts('localhost:1234', ['localhost:*'])).toBeTruthy();

		expect(uri.isEnabledHosts('www.localhost', ['*.localhost.*'])).toBeFalsy();
		expect(uri.isEnabledHosts('localhost.com', ['*.localhost.*'])).toBeFalsy();

		expect(uri.isEnabledHosts('localhost:1234', ['localhost'])).toBeFalsy();

		expect(uri.isEnabledHosts('localhost:1234', ['localhost', 'localhost:*'])).toBeTruthy();

	});
});
