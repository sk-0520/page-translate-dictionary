
export interface Placeholder {
	//#region property

	content: string,
	example?: string,

	//#endregion
}

export interface Message {
	//#region property

	message: string,
	description?: string,
	placeholders?: { [name: string]: Placeholder },

	//#endregion
}

export type MessageMap = { [name: string]: Message };

export interface IMessages {
	we_description: Message,

	popup_disabled_title: Message,
	popup_disabled_description_extension: Message,
	popup_disabled_description_setting: Message,

	popup_enabled_title: Message;
	popup_enabled_element_count: Message;
	popup_enabled_total_count: Message;
	popup_enabled_settings: Message;

	options_tab_header_generic: Message,

	options_tab_content_generic_translate: Message,
	options_tab_content_generic_translate_markReplacedElement: Message,

	options_tab_content_generic_setting: Message,
	options_tab_content_generic_setting_autoUpdate: Message,
	options_tab_content_generic_setting_updatedBeforeTranslation: Message,
	options_tab_content_generic_setting_periodDays: Message,

	options_tab_content_generic_save: Message,

	options_tab_header_settings: Message,

	options_tab_content_settings_item: Message,

	options_tab_content_settings_item_name: Message,
	options_tab_content_settings_item_version: Message,
	options_tab_content_settings_item_updatedTimestamp: Message,
	options_tab_content_settings_item_website: Message,
	options_tab_content_settings_item_repository: Message,
	options_tab_content_settings_item_document: Message,
	options_tab_content_settings_item_hosts: Message,
	options_tab_content_settings_item_details: Message,
	options_tab_content_settings_item_details_updateUrl: Message,
	options_tab_content_settings_item_details_website: Message,
	options_tab_content_settings_item_details_repository: Message,
	options_tab_content_settings_item_details_document: Message,
	options_tab_content_settings_item_details_id: Message,
	options_tab_content_settings_item_details_actions: Message,
	options_tab_content_settings_item_details_actions_delete: Message,
	options_tab_content_settings_item_details_actions_update: Message,
	options_tab_content_settings_item_details_actions_updating: Message,

	options_tab_content_settings_import: Message,

	options_tab_content_settings_import_submit: Message,

	options_import_log_start: Message,
	options_import_log_success: Message,
	options_import_log_invalid_url: Message,
	options_import_log_duplicated: Message,
	options_import_log_fetch_url: Message,
	options_import_log_invalid_setting: Message,
	options_import_log_setting: Message,
	options_import_log_host: Message,
	options_import_log_convert: Message,
}
