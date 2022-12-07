import * as locale from './locale';

const messages: locale.Messages & locale.MessageMap = {
	ext_name: {
		message: '定型翻訳'
	},
	ext_description: {
		message: '特定の要素のテキスト(かテキストノードか属性か値)に対する辞書的置き換え処理'
	},

	popup_disabled_title: {
		message: '非適用ページ',
	},
	popup_disabled_description_extension: {
		message: 'http(s):// から始まる URL で本拡張機能は有効になります。',
	},
	popup_disabled_description_setting: {
		message: '表示中ページに該当する設定が見つかりませんでした。',
	},

	popup_enabled_title: {
		message: '適用ページ',
	},
	popup_enabled_element_count: {
		message: '要素数',
	},
	popup_enabled_total_count: {
		message: '適用数',
	},
	popup_enabled_settings: {
		message: '適用設定ファイル一覧',
	},

	popup_extension_option: {
		message: 'オプション',
	},

	options_title: {
		message: '設定 - $TITLE$',
		placeholders: {
			'TITLE': {
				content: '$1',
			},
		}
	},
	popup_enabled_warning: {
		message: "翻訳処理が適用されています。\r\n翻訳された文言は原文と意味・解釈が異なるため\r\n正となる情報は原文を確認してください"
	},
	options_tab_header_generic: {
		message: '基本設定',
	},
	options_tab_content_generic_translate: {
		message: '翻訳設定',
	},
	options_tab_content_generic_translate_mark_replaced_element: {
		message: '置き換え部分をマークする',
	},

	options_tab_content_generic_setting: {
		message: '設定ファイル',
	},
	options_tab_content_generic_setting_auto_update: {
		message: '自動更新を行う',
	},
	options_tab_content_generic_setting_updated_before_translation: {
		message: '翻訳開始前に設定更新処理を行う',
	},
	options_tab_content_generic_setting_period_days: {
		message: '自動更新期間(日)',
	},

	options_tab_content_generic_save: {
		message: '保存',
	},

	options_tab_header_settings: {
		message: '設定ファイル',
	},
	options_tab_content_settings_item: {
		message: '設定ファイル一覧',
	},
	options_tab_content_settings_item_name: {
		message: '設定名',
	},
	options_tab_content_settings_item_version: {
		message: '設定バージョン',
	},
	options_tab_content_settings_item_updated_timestamp: {
		message: '最終更新日時(UTC)',
	},
	options_tab_content_settings_item_website: {
		message: 'Webサイト',
	},
	options_tab_content_settings_item_repository: {
		message: 'リポジトリ',
	},
	options_tab_content_settings_item_document: {
		message: 'ドキュメント',
	},
	options_tab_content_settings_item_hosts: {
		message: '有効ホスト一覧',
	},
	options_tab_content_settings_item_details: {
		message: '詳細',
	},
	options_tab_content_settings_item_details_updateUrl: {
		message: 'アップデートURL',
	},
	options_tab_content_settings_item_details_website: {
		message: 'ウェブサイト',
	},
	options_tab_content_settings_item_details_repository: {
		message: 'リポジトリ',
	},
	options_tab_content_settings_item_details_document: {
		message: 'ドキュメント',
	},
	options_tab_content_settings_item_details_id: {
		message: 'ID',
	},
	options_tab_content_settings_item_details_actions: {
		message: '処理',
	},
	options_tab_content_settings_item_details_actions_state_enabled: {
		message: '有効',
	},
	options_tab_content_settings_item_details_actions_state_disabled: {
		message: '無効',
	},
	options_tab_content_settings_item_details_actions_editor: {
		message: '編集',
	},
	options_tab_content_settings_item_details_actions_update: {
		message: '更新',
	},
	options_tab_content_settings_item_details_actions_updating: {
		message: '更新中',
	},
	options_tab_content_settings_item_details_actions_delete: {
		message: '削除',
	},

	options_tab_content_setting_create: {
		message: '新規作成',
	},

	options_tab_content_settings_import: {
		message: '取り込み',
	},

	options_tab_content_settings_import_submit: {
		message: '取り込み実行',
	},

	options_import_message: {
		message: '取り込みURL',
	},
	options_import_log_start: {
		message: '取り込み開始',
	},
	options_import_log_success: {
		message: '取り込み正常終了',
	},
	options_import_log_invalid_url: {
		message: 'URLが正しくない',
	},
	options_import_log_duplicated: {
		message: '既に存在する設定: $ID$',
		placeholders: {
			'ID': {
				content: '$1',
			},
		},
	},
	options_import_log_fetch_url: {
		message: '設定取得処理開始: $URL$',
		placeholders: {
			'URL': {
				content: '$1',
			},
		},
	},
	options_import_log_invalid_setting: {
		message: '設定ファイルが正しくない',
	},
	options_import_log_setting: {
		message: '設定データ取得: $NAME$ $VERSION$',
		placeholders: {
			'NAME': {
				content: '$1',
			},
			'VERSION': {
				content: '$2',
			},
		},
	},
	options_import_log_host: {
		message: '有効ホスト: $HOST$',
		placeholders: {
			'HOST': {
				content: '$1',
			},
		},
	},
	options_import_log_convert: {
		message: '変換処理開始',
	},

	options_tab_header_about: {
		message: '$NAME$について',
		placeholders: {
			'NAME': {
				content: '$1',
			}
		}
	},
	options_tab_content_about_library: {
		message: '使用ライブラリ',
	},
	options_tab_content_about_library_item_library: {
		message: 'ライブラリ',
	},
	options_tab_content_about_library_item_license: {
		message: 'ライセンス',
	},
	options_tab_content_about_library_item_publisher: {
		message: '発行者',
	},

	editor_new: {
		message: '新規作成',
	},
	editor_edit: {
		message: '編集',
	},
	editor_tab_header_head: {
		message: '基本',
	},
	editor_tab_content_head_id: {
		message: '内部ID',
	},
	editor_tab_content_head_state_header: {
		message: '有効状態',
	},
	editor_tab_content_head_state_is_enabled: {
		message: '有効にする',
	},
	editor_tab_content_head_update_url: {
		message: 'アップデートURL',
	},
	editor_tab_content_head_name: {
		message: '設定名',
	},
	editor_tab_content_head_version: {
		message: 'バージョン',
	},
	editor_tab_content_head_hosts: {
		message: '対象ホスト',
	},
	editor_tab_content_head_information: {
		message: '情報',
	},
	editor_tab_content_head_information_website: {
		message: 'Webサイト',
	},
	editor_tab_content_head_information_repository: {
		message: 'リポジトリ',
	},
	editor_tab_content_head_information_document: {
		message: 'ドキュメント',
	},
	editor_tab_content_head_priority: {
		message: '優先度',
	},
	editor_tab_content_head_language: {
		message: '翻訳先言語',
	},
	editor_tab_header_path: {
		message: 'パス',
	},
	editor_tab_header_common: {
		message: '共通',
	},
	editor_tab_header_watch: {
		message: '監視',
	},
	editor_tab_content_watch_window: {
		message: 'window',
	},
	editor_tab_content_watch_document: {
		message: 'window.document',
	},
	editor_save: {
		message: '保存',
	},

	validation_invalid: {
		message: '入力が正しくありません',
	}
};

export default messages;
