import webextension from 'webextension-polyfill';
import * as extensions from '../extensions';
import * as uri from "../uri";
import * as throws from "../../core/throws";

function applyDisableIcon(extension: extensions.Extension) {
	switch (extension.kind) {
		case extensions.BrowserKind.Firefox:
			webextension.browserAction.setBadgeText({
				text: '✖',
			});
			break;

		case extensions.BrowserKind.Chrome:
			webextension.action.setBadgeText({
				text: '✖',
			});
			break;

		default:
			throw new throws.NotImplementedError();
	}
}

async function changedActiveTabAsync(tab: webextension.Tabs.Tab | undefined, extension: extensions.Extension): Promise<void> {
	console.log(tab);

	if (tab && tab.url && uri.isUserUrl(tab.url)) {
		// TODO: 翻訳データ(有無も)をアイコン反映
		tab
	} else {
		// 翻訳対象外アイコン反映
		applyDisableIcon(extension);
	}
}

async function onTabActivatedAsync(activeInfo: webextension.Tabs.OnActivatedActiveInfoType, extension: extensions.Extension): Promise<void> {
	const tab = await webextension.tabs.get(activeInfo.tabId);
	return changedActiveTabAsync(tab, extension);
}

export function boot(extension: extensions.Extension) {
	webextension.tabs.onActivated.addListener(ev => onTabActivatedAsync(ev, extension));

	webextension.tabs.getCurrent().then(tab => {
		console.log('webextension.tabs.getCurrent', tab);
		changedActiveTabAsync(tab, extension);
	})
}
