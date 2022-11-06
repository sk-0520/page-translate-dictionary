import webextension from 'webextension-polyfill';
import * as extensions from '../extensions';
import * as messages from "../messages";
import * as uri from "../uri";
import * as throws from "../../core/throws";

function setBadgeTextAsync(details: webextension.Action.SetBadgeTextDetailsType, extension: extensions.Extension): Promise<void> {
	switch (extension.kind) {
		case extensions.BrowserKind.Firefox:
			return webextension.browserAction.setBadgeText(details);

		case extensions.BrowserKind.Chrome:
			return webextension.action.setBadgeText(details);

		default:
			throw new throws.NotImplementedError();
	}
}

function applyEnablePageIconAsync(pageInformation: messages.PageInformation, extension: extensions.Extension): Promise<void> {
	if (pageInformation.settings.length) {
		// 設定あり
		setBadgeTextAsync({
			text: pageInformation.translatedElementCount.toString(),
		}, extension);
	} else {
		// 設定なし
		setBadgeTextAsync({
			text: '🤔',
		}, extension);
	}

	return Promise.resolve();
}

function applyDisablePageIconAsync(extension: extensions.Extension): Promise<void> {
	return setBadgeTextAsync({
		text: '✖',
	}, extension);
}

async function changedActiveTabAsync(tab: webextension.Tabs.Tab | undefined, extension: extensions.Extension): Promise<void> {
	console.log(tab);

	if (tab && tab.id && tab.url && uri.isUserUrl(tab.url)) {
		// TODO: 翻訳データ(有無も)をアイコン反映
		const reply: messages.Replay & messages.PageInformation = await webextension.tabs.sendMessage(tab.id, {
			kind: messages.MessageKind.GetPageInformation,
		} as messages.Message);

		applyEnablePageIconAsync(reply, extension);
	} else {
		// 翻訳対象外アイコン反映
		applyDisablePageIconAsync(extension);
	}
}

async function onTabActivatedAsync(activeInfo: webextension.Tabs.OnActivatedActiveInfoType, extension: extensions.Extension): Promise<void> {
	const tab = await webextension.tabs.get(activeInfo.tabId);
	return changedActiveTabAsync(tab, extension);
}

async function receiveMessageAsync(message: messages.Message, sender: webextension.Runtime.MessageSender, extension: extensions.Extension): Promise<void> {
	switch (message?.kind) {
		case messages.MessageKind.NotifyPageInformation:
			//TODO: 型チェック
			applyEnablePageIconAsync(message as messages.PageInformation, extension);
			break;

		default:
			console.debug(message, sender);
			break;
	}
}

export function boot(extension: extensions.Extension) {
	webextension.tabs.onActivated.addListener(ev => onTabActivatedAsync(ev, extension));
	webextension.runtime.onMessage.addListener((message, sender) => receiveMessageAsync(message, sender, extension));

	webextension.tabs.getCurrent().then(tab => {
		console.log('webextension.tabs.getCurrent', tab);
		changedActiveTabAsync(tab, extension);
	})
}
