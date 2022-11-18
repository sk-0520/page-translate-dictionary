import * as webextension from 'webextension-polyfill';
//import * as JSONC from 'jsonc-parser'; パースエラー時にごっそり無くなる可能性があって危ない

import * as dom from '../../core/dom';
import * as types from '../../core/types';
import * as string from '../../core/string';
import * as extensions from '../extensions';
import * as config from '../config';
import * as storage from '../storage';
import * as setting from '../setting';
import * as loader from '../loader';
import * as localize from '../localize';

import '../../../styles/extension/setting-editor.scss';

const NewLine = "\n";

let CurrentId: config.SiteInternalId;
let CreateMode = false;

function toLineText(arr: ReadonlyArray<string> | null | undefined): string {
	if (!arr || !arr.length) {
		return '';
	}

	return arr.join(NewLine) + NewLine;
}

function toJsonText(obj: object | null | undefined): string {
	if (!obj) {
		return '';
	}

	return JSON.stringify(obj, undefined, 2) + NewLine;
}

function createEmptyHead(): config.SiteHeadConfiguration {
	const result: config.SiteHeadConfiguration = {
		updateUrl: '',
		updatedTimestamp: '',
		lastCheckedTimestamp: '',

		version: '0.0.0',
		hosts: [],
		information: {
			websiteUrl: '',
			repositoryUrl: '',
			documentUrl: '',
		},
		priority: 0,
		language: navigator.language,

		id: loader.createSiteInternalId(),
		name: '',
	};

	return result;
}

function createEmptyBody(): config.SiteBodyConfiguration {
	const result: config.SiteBodyConfiguration = {
		watch: {},
		path: {},
		common: {},
	};

	return result;
}

function getSettingElements() {
	return {
		id: dom.requireElementById('id', HTMLInputElement),
		name: dom.requireElementById('name', HTMLInputElement),
		updateUrl: dom.requireElementById('update_url', HTMLInputElement),
		version: dom.requireElementById('version', HTMLInputElement),
		hosts: dom.requireElementById('hosts', HTMLTextAreaElement),

		informationWebsite: dom.requireElementById('information_website', HTMLInputElement),
		informationRepository: dom.requireElementById('information_repository', HTMLInputElement),
		informationDocument: dom.requireElementById('information_document', HTMLInputElement),

		priority: dom.requireElementById('priority', HTMLInputElement),
		language: dom.requireElementById('language', HTMLInputElement),

		// パス
		jsonPath: dom.requireElementById('path_json', HTMLTextAreaElement),
		// 共通
		jsonCommon: dom.requireElementById('common_json', HTMLTextAreaElement),

		// 監視
		watchWindow: dom.requireElementById('watch_window', HTMLTextAreaElement),
		watchDocument: dom.requireElementById('watch_document', HTMLTextAreaElement),
	}
}

function setValues(head: config.SiteHeadConfiguration, body: config.SiteBodyConfiguration): void {

	const elements = getSettingElements();

	//ヘッダ
	elements.id.value = head.id;
	elements.updateUrl.value = head.updateUrl;
	elements.name.value = head.name;
	elements.version.value = head.version;
	elements.hosts.value = toLineText(head.hosts);

	elements.informationWebsite.value = head.information.websiteUrl;
	elements.informationRepository.value = head.information.repositoryUrl;
	elements.informationDocument.value = head.information.documentUrl;

	elements.priority.value = head.priority.toString();
	elements.language.value = head.language;
	if (types.hasArray(navigator, types.nameof<Navigator>('languages'))) {
		const languageListElement = dom.requireElementById('language-list', HTMLDataListElement);
		for (const language of navigator.languages) {
			const optionElement = document.createElement('option');
			optionElement.value = language;

			languageListElement.appendChild(optionElement);
		}
	}

	// パス
	elements.jsonPath.value = toJsonText(body.path);
	// 共通
	elements.jsonCommon.value = toJsonText(body.common);
	// 監視
	elements.watchWindow.value = toLineText(body.watch.window);
	elements.watchDocument.value = toLineText(body.watch.document);
}

async function saveAsync(id: config.SiteInternalId): Promise<boolean> {
	const elements = getSettingElements();

	const hosts = string.splitLines(elements.hosts.value)
		.map(i => string.trim(i))
		.filter(i => i)
		;

	if (!hosts.length) {
		elements.hosts.setCustomValidity(webextension.i18n.getMessage('validation_invalid'));
	}

	function exceptionCatcher<TException extends undefined, TResult>(func: () => TResult): { result: TResult, exception: TException | undefined } {
		let result: TResult;
		let exception: TException | undefined = undefined;
		try {
			result = func();
		} catch (ex) {
			exception = ex as TException | undefined;
		}

		return {
			//@ts-ignore
			result: result,
			exception: exception,
		}
	}

	const jsonPathResult = exceptionCatcher(() => JSON.parse(elements.jsonPath.value));
	console.debug('jsonPathResult', jsonPathResult);
	if (jsonPathResult.exception) {
		elements.jsonPath.setCustomValidity(String(jsonPathResult.exception));
	} else {
		elements.jsonPath.setCustomValidity('');
	}

	const jsonCommonResult = exceptionCatcher(() => JSON.parse(elements.jsonCommon.value));
	console.debug('jsonCommonResult', jsonCommonResult);
	if (jsonCommonResult.exception) {
		elements.jsonCommon.setCustomValidity(String(jsonCommonResult.exception));
	} else {
		elements.jsonCommon.setCustomValidity('');
	}

	const elementItems = Object.values(elements);
	if (elementItems.some(i => !i.validity.valid)) {
		console.warn('検証エラー');
		for (const elementItem of elementItems) {
			elementItem.reportValidity();
		}

		for (const element of elementItems) {
			element.setCustomValidity('');
		}

		return false;
	}

	const timestamp = (new Date()).toISOString();
	const head: config.SiteHeadConfiguration = {
		id: id,
		name: string.trim(elements.name.value),
		updateUrl: elements.updateUrl.value.trim(),
		updatedTimestamp: timestamp,
		lastCheckedTimestamp: timestamp,
		version: string.trim(elements.version.value),
		hosts: hosts,
		information: {
			websiteUrl: elements.informationWebsite.value.trim(),
			repositoryUrl: elements.informationRepository.value.trim(),
			documentUrl: elements.informationDocument.value.trim(),
		},
		language: string.trim(elements.language.value),
		priority: parseInt(elements.priority.value),
	};

	const body: config.SiteBodyConfiguration = {
		watch: {
			window: string.splitLines(elements.watchWindow.value).filter(i => i),
			document: string.splitLines(elements.watchDocument.value).filter(i => i),
		},
		path: jsonPathResult.result as setting.PathMap,
		common: jsonCommonResult.result as setting.CommonSetting,
	};

	await storage.saveSiteBodyAsync(id, body);

	const heads = await storage.loadSiteHeadsAsync();
	const newHeads = heads.filter(i => i.id !== id);
	newHeads.push(head);

	await storage.saveSiteHeadsAsync(newHeads);

	return true;
}

async function bootAsync(id: config.SiteInternalId | null, extension: extensions.Extension): Promise<void> {
	localize.applyView()

	let head: config.SiteHeadConfiguration | null = null;
	let body: config.SiteBodyConfiguration | null = null;

	if (id) {
		const heads = await storage.loadSiteHeadsAsync();
		const targets = heads.filter(i => i.id === id);
		if (targets.length === 1) {
			head = targets[0];

			body = await storage.loadSiteBodyAsync(id)
		} else {
			console.warn('not found id', id);
		}
	}

	if (!head) {
		head = createEmptyHead();
		CreateMode = true;
	}
	CurrentId = head.id;

	if (!body) {
		body = createEmptyBody();
	}

	setValues(head, body);

	const title = webextension.i18n.getMessage('ext_name');
	if (CreateMode) {
		const titleHead = webextension.i18n.getMessage('editor_new');
		document.title = `${titleHead} - ${title}`;
	} else {
		const titleHead = webextension.i18n.getMessage('editor_edit');
		document.title = `${titleHead} ${head.name} - ${title}`;
	}

	dom.requireElementById('editor').addEventListener('submit', async ev => {
		ev.preventDefault();

		if (await saveAsync(CurrentId)) {
			if (CreateMode) {
				location.search = location.href + '&setting=' + CurrentId;
			} else {
				location.reload();
			}
		}
	});

	dom.requireElementById('editor').classList.remove('loading');
	dom.requireElementById('processing').classList.add('processed');
}

export function boot(extension: extensions.Extension) {
	const searchParams = new URLSearchParams(window.location.search);
	const settingRawId = searchParams.get('setting');
	const settingId = settingRawId
		? config.toInternalId(settingRawId)
		: null
		;

	bootAsync(settingId, extension);
}
