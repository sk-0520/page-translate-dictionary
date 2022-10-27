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
});
