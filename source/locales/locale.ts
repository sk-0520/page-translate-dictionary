
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

export interface Messages {
	ext_name: Message,
	ext_description: Message,

	popup_disabled_title: Message,
	popup_disabled_description_extension: Message,
	popup_disabled_description_setting: Message,

	popup_enabled_title: Message;
	popup_enabled_warning: Message;
	popup_enabled_element_count: Message;
	popup_enabled_total_count: Message;
	popup_enabled_settings: Message;

	options_title: Message,
	options_tab_header_generic: Message,

	options_tab_content_generic_translate: Message,
	options_tab_content_generic_translate_mark_replaced_element: Message,

	options_tab_content_generic_setting: Message,
	options_tab_content_generic_setting_auto_update: Message,
	options_tab_content_generic_setting_updated_before_translation: Message,
	options_tab_content_generic_setting_period_days: Message,

	options_tab_content_generic_save: Message,

	options_tab_header_settings: Message,

	options_tab_content_settings_item: Message,

	options_tab_content_settings_item_name: Message,
	options_tab_content_settings_item_version: Message,
	options_tab_content_settings_item_updated_timestamp: Message,
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
	options_tab_content_settings_item_details_actions_editor: Message,
	options_tab_content_settings_item_details_actions_delete: Message,
	options_tab_content_settings_item_details_actions_update: Message,
	options_tab_content_settings_item_details_actions_updating: Message,

	options_tab_content_setting_create: Message,

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

	editor_new: Message;
	editor_edit: Message;
	editor_tab_header_head: Message,
	editor_tab_content_head_id: Message,
	editor_tab_content_head_update_url: Message,
	editor_tab_content_head_name: Message,
	editor_tab_content_head_version: Message,
	editor_tab_content_head_hosts: Message,
	editor_tab_content_head_information: Message,
	editor_tab_content_head_information_website: Message,
	editor_tab_content_head_information_repository: Message,
	editor_tab_content_head_information_document: Message,
	editor_tab_content_head_priority: Message,
	editor_tab_content_head_language: Message,
	editor_tab_header_path: Message,
	editor_tab_header_common: Message,
	editor_tab_header_watch: Message,
	editor_tab_content_watch_window: Message,
	editor_tab_content_watch_document: Message,
	editor_save: Message,

	validation_invalid: Message,
}
