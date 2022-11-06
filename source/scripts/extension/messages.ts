import * as config from './config';

export const enum MessageKind {
	Unknown,
	GetPageInformation,
	NotifyPageInformation,
}

/** 送信データ */
export interface Message {
	//#region property

	kind?: MessageKind;

	//#endregion
}

/** 応答データ */
export interface Replay {
	//#region property
	//#endregion
}

/** ページ情報 */
export interface PageInformation {
	//#region property

	readonly translatedElementCount: number;
	readonly translatedTotalCount: number;

	readonly settings: ReadonlyArray<config.SiteHeadConfiguration>;

	//#endregion
}
