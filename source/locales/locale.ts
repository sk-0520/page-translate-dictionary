
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
	we_description: IMessage,

	options_tab_header_generic: IMessage,

	options_tab_content_generic_translate: IMessage,
	options_tab_content_generic_translate_markReplacedElement: IMessage,

	options_tab_content_generic_setting: IMessage,
	options_tab_content_generic_setting_autoUpdate: IMessage,
	options_tab_content_generic_setting_updatedBeforeTranslation: IMessage,
	options_tab_content_generic_setting_periodDays: IMessage,

	options_tab_content_generic_save: IMessage,

	options_tab_header_settings: IMessage,

	options_tab_content_settings_item: IMessage,

	options_tab_content_settings_item_name: IMessage,
	options_tab_content_settings_item_version: IMessage,
	options_tab_content_settings_item_updatedTimestamp: IMessage,
	options_tab_content_settings_item_website: IMessage,
	options_tab_content_settings_item_repository: IMessage,
	options_tab_content_settings_item_document: IMessage,
	options_tab_content_settings_item_hosts: IMessage,
	options_tab_content_settings_item_details: IMessage,
	options_tab_content_settings_item_details_updateUrl: IMessage,
	options_tab_content_settings_item_details_website: IMessage,
	options_tab_content_settings_item_details_repository: IMessage,
	options_tab_content_settings_item_details_document: IMessage,
	options_tab_content_settings_item_details_id: IMessage,
	options_tab_content_settings_item_details_actions: IMessage,
	options_tab_content_settings_item_details_actions_editor: IMessage,
	options_tab_content_settings_item_details_actions_update: IMessage,
	options_tab_content_settings_item_details_actions_updating: IMessage,
	options_tab_content_settings_item_details_actions_delete: IMessage,

	options_tab_content_settings_import: IMessage,

	options_tab_content_settings_import_submit: IMessage,

	options_import_log_start: IMessage,
	options_import_log_success: IMessage,
	options_import_log_invalid_url: IMessage,
	options_import_log_duplicated: IMessage,
	options_import_log_fetch_url: IMessage,
	options_import_log_invalid_setting: IMessage,
	options_import_log_setting: IMessage,
	options_import_log_host: IMessage,
	options_import_log_convert: IMessage,

	editor_tab_header_editor: IMessage,
	editor_tab_content_editor_head: IMessage,
	editor_tab_content_editor_head_name: IMessage,
	editor_tab_content_editor_head_id: IMessage,

	editor_tab_content_editor_path: IMessage,

	editor_tab_content_editor_common: IMessage,

	editor_tab_header_raw: IMessage,
}
