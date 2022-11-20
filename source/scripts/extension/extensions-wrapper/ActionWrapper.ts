import webextension from 'webextension-polyfill';
import * as extensions from "../extensions";
import * as throws from '../../core/throws';
import Wrapper from "./Wrapper";

/**
 * browserAction/action を同じように扱う。
 */
export default class ActionWrapper extends Wrapper {
	constructor(extension: extensions.Extension) {
		super(extension)
	}

	//#region function

	public async setBadgeTextAsync(tabId: number | undefined, text: string, foregroundColor: string, backgroundColor: string, extension: extensions.Extension): Promise<void> {
		this.setBadgeTextColor({
			color: foregroundColor,
			tabId: tabId,
		});
		await this.setBadgeText({
			text: text,
			tabId: tabId,
		});
		await this.setBadgeBackgroundColor({
			color: backgroundColor,
			tabId: tabId,
		});
	}

	public setActionEnableAsync(tabId: number | undefined, isEnabled: boolean): Promise<void> {
		return isEnabled
			? this.enable(tabId)
			: this.disable(tabId)
			;
	}

	//#endregion

	//#region browserAction/action

	public setBadgeText(details: webextension.Action.SetBadgeTextDetailsType): Promise<void> {
		switch (this.extension.kind) {
			case extensions.BrowserKind.Firefox:
				return webextension.browserAction.setBadgeText(details);

			case extensions.BrowserKind.Chrome:
				return webextension.action.setBadgeText(details);

			default:
				throw new throws.NotImplementedError();
		}
	}

	public setBadgeTextColor(details: webextension.Action.SetBadgeTextColorDetailsType): void {
		switch (this.extension.kind) {
			case extensions.BrowserKind.Firefox:
				webextension.browserAction.setBadgeTextColor(details);
				break;

			case extensions.BrowserKind.Chrome:
				// chrome は色変わらない？
				//webextension.action.setBadgeTextColor(details);
				break;

			default:
				throw new throws.NotImplementedError();
		}
	}

	public setBadgeBackgroundColor(details: webextension.Action.SetBadgeBackgroundColorDetailsType): Promise<void> {
		switch (this.extension.kind) {
			case extensions.BrowserKind.Firefox:
				return webextension.browserAction.setBadgeBackgroundColor(details);

			case extensions.BrowserKind.Chrome:
				return webextension.action.setBadgeBackgroundColor(details);

			default:
				throw new throws.NotImplementedError();
		}
	}

	public enable(tabId?: number | undefined): Promise<void> {
		switch (this.extension.kind) {
			case extensions.BrowserKind.Firefox:
				return webextension.browserAction.enable(tabId);

			case extensions.BrowserKind.Chrome:
				return webextension.action.enable(tabId);

			default:
				throw new throws.NotImplementedError();
		}
	}

	public disable(tabId?: number | undefined): Promise<void> {
		switch (this.extension.kind) {
			case extensions.BrowserKind.Firefox:
				return webextension.browserAction.disable(tabId);

			case extensions.BrowserKind.Chrome:
				return webextension.action.disable(tabId);

			default:
				throw new throws.NotImplementedError();
		}
	}

	//#endregion
}
