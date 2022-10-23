
export interface IPlaceholder {
	//#region property

	content: string,
	example?: string,

	//#endregion
}

export interface IMessage {
	//#region property

	message: string,
	description?: string,
	placeholders?: { [name: string]: IPlaceholder },

	//#endregion
}

export type MessageMap = { [name: string]: IMessage };

export interface IMessages {
	options_tab_header_generic: IMessage,

	options_tab_content_generic_translate: IMessage,
	options_tab_content_generic_translate_markReplacedElement: IMessage,

	options_tab_content_generic_setting: IMessage,
	options_tab_content_generic_setting_autoUpdate: IMessage,
	options_tab_content_generic_setting_periodDays: IMessage,

	options_tab_content_generic_save: IMessage,

	options_tab_header_defines: IMessage,
}
