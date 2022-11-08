import webextension from 'webextension-polyfill';
import * as extensions from '../extensions';
import * as messages from "../messages";
import * as uri from "../uri";

async function applyEnablePageIconAsync(tabId: number | undefined, pageInformation: messages.PageInformation, extension: extensions.Extension): Promise<void> {
	if (pageInformation.settings.length) {
		// 設定あり
		await extension.action.setBadgeTextAsync(
			tabId,
			pageInformation.translatedElementCount.toString(),
			'#eee',
			'#222',
			extension
		);
		//[ACTION:ENABLED/DISABLE]await extension.action.setActionEnableAsync(tabId, true);
	} else {
		// 設定なし
		await extension.action.setBadgeTextAsync(
			tabId,
			'-',
			'#111',
			'#ccc',
			extension
		);
		//[ACTION:ENABLED/DISABLE]await extension.action.setActionEnableAsync(tabId, false);
	}
}

async function applyDisablePageIconAsync(tabId: number | undefined, extension: extensions.Extension): Promise<void> {
	await extension.action.setBadgeTextAsync(
		tabId,
		'*',
		'#111',
		'#ccc',
		extension
	);
	//[ACTION:ENABLED/DISABLE]await extension.action.setActionEnableAsync(tabId, false);
}

async function changedActiveTabAsync(tab: webextension.Tabs.Tab | undefined, extension: extensions.Extension): Promise<void> {
	console.log('tab', tab);

	if (tab && tab.id && tab.url && uri.isHttpUrl(tab.url)) {
		try {
			const reply: messages.Replay & messages.PageInformation = await webextension.tabs.sendMessage(tab.id, {
				kind: messages.MessageKind.GetPageInformation,
			} as messages.Message);
			console.log('reply', reply);
			await applyEnablePageIconAsync(tab.id, reply, extension);
		} catch (ex) {
			console.debug('応答なし(差し込んでない)', ex);
			await applyEnablePageIconAsync(tab.id, {
				translatedElementCount: 0,
				translatedTotalCount: 0,
				settings: []
			}, extension);
		}
	} else {
		// 翻訳対象外アイコン反映
		await applyDisablePageIconAsync(tab?.id, extension);
	}
}

async function onTabActivatedAsync(activeInfo: webextension.Tabs.OnActivatedActiveInfoType, extension: extensions.Extension): Promise<void> {
	const tab = await webextension.tabs.get(activeInfo.tabId);
	return changedActiveTabAsync(tab, extension);
}

async function receiveMessageAsync(message: messages.Message, sender: webextension.Runtime.MessageSender, extension: extensions.Extension): Promise<void> {
	console.trace(message, sender);

	switch (message?.kind) {
		case messages.MessageKind.NotifyPageInformation:
			//TODO: 型チェック
			await applyEnablePageIconAsync(sender.tab?.id, message as messages.PageInformation, extension);
			break;

		default:
			console.debug(message, sender);
			break;
	}
}

export function boot(extension: extensions.Extension) {
	console.info('background boot!');

	webextension.tabs.onActivated.addListener(ev => onTabActivatedAsync(ev, extension));
	webextension.runtime.onMessage.addListener((message, sender) => receiveMessageAsync(message, sender, extension));

	webextension.tabs.getCurrent().then(tab => {
		console.log('webextension.tabs.getCurrent', tab);
		changedActiveTabAsync(tab, extension);
	})
}
