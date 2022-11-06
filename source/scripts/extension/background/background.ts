import webextension from 'webextension-polyfill';
import * as extensions from '../extensions';
import * as messages from "../messages";
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

	if (tab && tab.id && tab.url && uri.isUserUrl(tab.url)) {
		// TODO: 翻訳データ(有無も)をアイコン反映
		const reply: messages.PageInformationReplay = await webextension.tabs.sendMessage(tab.id, {
			sender: messages.Sender.Background,
			abc: 'def'
		} as messages.PageMessage);

		if (reply.settings.length) {
			// 設定あり
			webextension.browserAction.setBadgeText({
				text: reply.translatedElementCount.toString(),
			});
		} else {
			// 設定なし
			webextension.browserAction.setBadgeText({
				text: '🤔',
			});
		}
	} else {
		// 翻訳対象外アイコン反映
		applyDisableIcon(extension);
	}
}

async function onTabActivatedAsync(activeInfo: webextension.Tabs.OnActivatedActiveInfoType, extension: extensions.Extension): Promise<void> {
	const tab = await webextension.tabs.get(activeInfo.tabId);
	return changedActiveTabAsync(tab, extension);
}

async function receiveMessageAsync(message: messages.BackgroundMessage, sender: webextension.Runtime.MessageSender): Promise<void> {
	switch (message?.sender) {
		case messages.Sender.Page:
			break;

		default:
			console.debug(message, sender);
			break;
	}
}

export function boot(extension: extensions.Extension) {
	webextension.tabs.onActivated.addListener(ev => onTabActivatedAsync(ev, extension));
	webextension.runtime.onMessage.addListener((message, sender) => receiveMessageAsync(message, sender));

	webextension.tabs.getCurrent().then(tab => {
		console.log('webextension.tabs.getCurrent', tab);
		changedActiveTabAsync(tab, extension);
	})
}
