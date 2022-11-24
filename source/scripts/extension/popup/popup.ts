import webextension from 'webextension-polyfill';
import * as dom from '../../core/dom';
import * as localize from '../localize';
import * as extensions from '../extensions';
import * as messages from '../messages';
import '../../../styles/extension/popup-action.scss';

function changeEnablePopup(isEnabled: boolean) {
	const disabledElement = dom.requireElementById('disabled');
	const enabledElement = dom.requireElementById('enabled');

	if (isEnabled) {
		disabledElement.classList.add('inactive');
		enabledElement.classList.add('active');;
	} else {
		disabledElement.classList.remove('inactive');
		enabledElement.classList.remove('active');;
	}
}

function applyEnablePopupAsync(tab: webextension.Tabs.Tab, pageInformation: messages.PageInformation, extension: extensions.Extension): Promise<void> {
	changeEnablePopup(true);

	const elementCountElement = dom.requireElementById('element_count');
	elementCountElement.textContent = pageInformation.translatedElementCount.toString();
	const totalCountElement = dom.requireElementById('total_count');
	totalCountElement.textContent = pageInformation.translatedTotalCount.toString();

	const templateElement = dom.requireElementById('template-setting-item', HTMLTemplateElement);
	const settingElement = dom.requireElementById('settings');
	dom.clearContent(settingElement);
	for (const setting of pageInformation.settings) {
		const itemElement = dom.cloneTemplate(templateElement);

		dom.requireSelector(itemElement, '[name="settings_item_name"]').textContent = setting.name;

		localize.applyNestElements(itemElement);

		settingElement.appendChild(itemElement);
	}

	return Promise.resolve();
}

function applyDisablePopupAsync(tab: webextension.Tabs.Tab, extension: extensions.Extension): Promise<void> {
	changeEnablePopup(false);

	return Promise.resolve();
}

async function applyTabAsync(tab: webextension.Tabs.Tab, extension: extensions.Extension): Promise<void> {
	try {
		const reply: messages.Replay & messages.PageInformation = await webextension.tabs.sendMessage(tab.id!, {
			kind: messages.MessageKind.GetPageInformation,
		} as messages.Message);
		console.trace('POPUP reply', reply);
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
	await applyTabAsync(tab, extension);
	localize.applyView();
}

export function boot(extension: extensions.Extension) {
	bootAsync(extension);
}
