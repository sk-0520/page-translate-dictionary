import * as localize from '../../core/localize';
import * as dom from '../../core/dom';
import * as storage from '../storage';
import * as config from '../config';

import '../../../styles/extension/setting-editor.scss';

function applyEditorHead(head: config.SiteHeadConfiguration): void {
	dom.requireElementById('editor_tab_content_editor_head_name').textContent = head.name;
	dom.requireElementById('editor_tab_content_editor_head_id').textContent = head.id;
}

function applyRaw(body: config.SiteBodyConfiguration) {
	const contentRawElement = dom.requireElementById('editor_tab_content_raw');
	contentRawElement.textContent = JSON.stringify(body, undefined, 2);
}

async function bootAsync(id: config.SiteInternalId): Promise<void> {
	const heads = await storage.loadSiteHeadsAsync();
	const currentHeads = heads.filter(i => i.id === id);
	if (currentHeads.length !== 1) {
		throw new Error('not found: ' + id);
	}

	const currentHead = currentHeads[0];
	applyEditorHead(currentHead);

	const body = await storage.loadSiteBodyAsync(id);
	if (body) {
		applyRaw(body);
	}

	localize.applyView();
}

export function boot() {
	const searchParams = new URLSearchParams(window.location.search);
	const settingId = searchParams.get('setting');
	if (settingId) {
		bootAsync(settingId);
	} else {
		throw new Error(window.location.origin);
	}
}
