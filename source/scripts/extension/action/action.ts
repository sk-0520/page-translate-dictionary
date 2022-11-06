import webextension from 'webextension-polyfill';

import '../../../styles/extension/popup-action.scss';

async function onTabActivatedAsync(activeInfo: webextension.Tabs.OnActivatedActiveInfoType): Promise<void> {
	console.debug('test', activeInfo);
	const tab = await webextension.tabs.get(activeInfo.tabId);
	document.getElementById('x')!.textContent = tab.title || 'aaaa';
}

export function boot() {
	webextension.tabs.onActivated.addListener(onTabActivatedAsync);
}
