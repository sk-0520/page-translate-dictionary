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

function setBadgeTextColor(details: webextension.Action.SetBadgeTextColorDetailsType, extension: extensions.Extension): void {
	switch (extension.kind) {
		case extensions.BrowserKind.Firefox:
			webextension.browserAction.setBadgeTextColor(details);
			break;

		case extensions.BrowserKind.Chrome:
			webextension.action.setBadgeTextColor(details);
			break;

		default:
			throw new throws.NotImplementedError();
	}
}

function setBadgeBackgroundColorAsync(details: webextension.Action.SetBadgeBackgroundColorDetailsType, extension: extensions.Extension): Promise<void> {
	switch (extension.kind) {
		case extensions.BrowserKind.Firefox:
			return webextension.browserAction.setBadgeBackgroundColor(details);

		case extensions.BrowserKind.Chrome:
			return webextension.action.setBadgeBackgroundColor(details);

		default:
			throw new throws.NotImplementedError();
	}
}

async function setBadgeAsync(tabId: number |undefined, text: string, foregroundColor: string, backgroundColor: string, extension: extensions.Extension): Promise<void> {
	setBadgeTextColor({
		color: foregroundColor,
		tabId: tabId,
	}, extension);
	await setBadgeTextAsync({
		text: text,
		tabId: tabId,
	}, extension);
	await setBadgeBackgroundColorAsync({
		color: backgroundColor,
		tabId: tabId,
	}, extension);
}

async function applyEnablePageIconAsync(tabId: number |undefined ,pageInformation: messages.PageInformation, extension: extensions.Extension): Promise<void> {
	if (pageInformation.settings.length) {
		// 設定あり
		await setBadgeAsync(
			tabId,
			pageInformation.translatedElementCount.toString(),
			'#eee',
			'#222',
			extension
		)
	} else {
		// 設定なし
		await setBadgeAsync(
			tabId,
			'🤔',
			'#222',
			'#ccc',
			extension
		)
	}

	return Promise.resolve();
}

async function applyDisablePageIconAsync(tabId: number |undefined , extension: extensions.Extension): Promise<void> {
	await setBadgeAsync(
		tabId,
		'✖',
		'#111',
		'#ccc',
		extension
	);
}

async function changedActiveTabAsync(tab: webextension.Tabs.Tab | undefined, extension: extensions.Extension): Promise<void> {
	console.log('tab', tab);

	if (tab && tab.id && tab.url && uri.isUserUrl(tab.url)) {
		try {
			const reply: messages.Replay & messages.PageInformation = await webextension.tabs.sendMessage(tab.id, {
				kind: messages.MessageKind.GetPageInformation,
			} as messages.Message);
			console.log('reply', reply);
			applyEnablePageIconAsync(tab.id, reply, extension);
		} catch (ex) {
			console.debug('応答なし(差し込んでない)', ex);
			applyEnablePageIconAsync(tab.id, {
				translatedElementCount: 0,
				translatedTotalCount: 0,
				settings: []
			}, extension);

		}
	} else {
		// 翻訳対象外アイコン反映
		applyDisablePageIconAsync(tab?.id, extension);
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
			applyEnablePageIconAsync(sender.tab?.id, message as messages.PageInformation, extension);
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
