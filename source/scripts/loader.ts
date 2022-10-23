import webextension from "webextension-polyfill";
import * as JSONC from 'jsonc-parser';
import * as setting from './setting';

export function checkUrl(s: string): boolean {
	return s.startsWith('https://') || s.startsWith('http://');
}

export async function fetchAsync(url: string): Promise<setting.ISiteSetting | null> {
	const manifest = webextension.runtime.getManifest();

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			//'Content-Type': 'application/json',
			'X-WebExtensions': `${manifest.name} ${manifest.version}`,
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP Status: ${response.status} (${response.statusText})`);
	}

	const body = await response.text();

	const json = JSONC.parse(body, undefined, {
		allowEmptyContent: true,
		allowTrailingComma: true,
		disallowComments: true,
	});

	return json as setting.ISiteSetting;
}

//export function loadAsync(): Promise<>
