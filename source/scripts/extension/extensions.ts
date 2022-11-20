import webextension from 'webextension-polyfill';
import ActionWrapper from './extensions-wrapper/ActionWrapper';

export const enum BrowserKind {
	Firefox,
	Chrome,
}

export class Extension {
	//#region variable

	public readonly manifest: webextension.Manifest.WebExtensionManifest;

	public readonly action: ActionWrapper;

	//#endregion

	public constructor(public readonly kind: BrowserKind) {
		this.manifest = webextension.runtime.getManifest();
		this.action = new ActionWrapper(this);
	}

	//#region property
	//#endregion

	//#region function
	//#endregion
}
