import webextension from 'webextension-polyfill';

export const enum BrowserKind {
	Firefox,
	Chrome,
}

export class Extension {
	//#region variable

	public readonly manifest: webextension.Manifest.WebExtensionManifest;

	//#endregion

	public constructor(public readonly kind: BrowserKind) {
		this.manifest = webextension.runtime.getManifest();
	}

	//#region property
	//#endregion

	//#region function
	//#endregion
}
