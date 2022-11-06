import webextension from 'webextension-polyfill';
import * as extensions from '../extensions';
import * as messages from '../messages';
import '../../../styles/extension/popup-action.scss';

function applyEnablePopupAsync(tab: webextension.Tabs.Tab, pageInformation: messages.PageInformation, extension: extensions.Extension): Promise<void> {
	document.getElementById('x')!.textContent = tab.url!;
	document.getElementById('y')!.textContent = tab.title!;

	return Promise.resolve();
}

function applyDisablePopupAsync(tab: webextension.Tabs.Tab, extension: extensions.Extension): Promise<void> {
	return Promise.resolve();
}

async function applyTabAsync(tab: webextension.Tabs.Tab, extension: extensions.Extension): Promise<void> {
	try {
		const reply: messages.Replay & messages.PageInformation = await webextension.tabs.sendMessage(tab.id!, {
			kind: messages.MessageKind.GetPageInformation,
		} as messages.Message);
		return applyEnablePopupAsync(tab, reply, extension);
	} catch (ex) {
		console.debug('応答なし(差し込んでない)', ex);
	}

	return applyDisablePopupAsync(tab, extension);
}

async function bootAsync(extension: extensions.Extension): Promise<void> {
	const tabs = await webextension.tabs.query({
		active: true,
		currentWindow: true
	});

	if (tabs.length !== 1) {
		console.warn('TAB', tabs);
		return;
	}

	const tab = tabs[0];
	return applyTabAsync(tab, extension);
}

export function boot(extension: extensions.Extension) {
	bootAsync(extension);
}
