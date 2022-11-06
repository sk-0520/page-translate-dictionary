import * as config from './config';

export const enum Sender {
	Page,
	Background,
}

export interface Message {
	//#region property

	sender: Sender;

	//#endregion
}

/** ページへの送信メッセージ */
export interface PageMessage extends Message {
	//#region property
	//#endregion
}

/** バックグラウンドへの送信メッセージ */
export interface BackgroundMessage extends Message {
	//#region property
	//#endregion
}

/** 応答データ */
export interface Replay {
	//#region property
	//#endregion
}

/** ページからバックグラウンドへの応答メッセージ */
export interface PageInformationReplay extends Replay {
	//#region property

	readonly translatedElementCount: number;
	readonly translatedTotalCount: number;

	readonly settings: ReadonlyArray<config.SiteHeadConfiguration>;

	//#endregion
}
