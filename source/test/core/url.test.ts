import * as url from '../../scripts/core/url';

describe('url', () => {
	test('isHttpUrl', () => {
		expect(url.isHttpUrl('')).toBeFalsy();
		expect(url.isHttpUrl(' http:// ')).toBeFalsy();

		expect(url.isHttpUrl('http')).toBeFalsy();
		expect(url.isHttpUrl('http:')).toBeFalsy();
		expect(url.isHttpUrl('http:/')).toBeFalsy();
		expect(url.isHttpUrl('http://')).toBeFalsy();
		expect(url.isHttpUrl('http://x')).toBeTruthy();

		expect(url.isHttpUrl('https')).toBeFalsy();
		expect(url.isHttpUrl('https:')).toBeFalsy();
		expect(url.isHttpUrl('https:/')).toBeFalsy();
		expect(url.isHttpUrl('https://')).toBeFalsy();
		expect(url.isHttpUrl('https://x')).toBeTruthy();
	});

	test('joinPath', () =>{
		expect(url.joinPath('a', 'b')).toBe('a/b');
		expect(url.joinPath('a/', 'b')).toBe('a/b');
		expect(url.joinPath('a', '/b')).toBe('a/b');
		expect(url.joinPath('a/', '/b')).toBe('a/b');
		expect(url.joinPath('a//', '//b')).toBe('a/b');
		expect(url.joinPath('/a//', '//b')).toBe('/a/b');
		expect(url.joinPath('a//', '//b/')).toBe('a/b');
		expect(url.joinPath('/a//', '//b/')).toBe('/a/b');
		expect(url.joinPath('//a//', '//b//')).toBe('//a/b');

		expect(url.joinPath('', '')).toBe('/');
		expect(url.joinPath('/', '/')).toBe('/');
		expect(url.joinPath('/a/b', '/c/', 'd/', '/e')).toBe('/a/b/c/d/e');
		expect(url.joinPath('/a/b/', '/c/', 'd/', '/e')).toBe('/a/b/c/d/e');
		expect(url.joinPath('/a///////', 'b')).toBe('/a/b');
		expect(url.joinPath('a', '/////b', 'c/////////', '///////d////////')).toBe('a/b/c/d');
	})
});
