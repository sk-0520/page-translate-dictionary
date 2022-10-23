import * as locale from './locale';

const messages: locale.IMessages & locale.MessageMap = {
	options_tab_header_generic: {
		message: '基本設定',
	},
	options_tab_content_generic_translate: {
		message: '翻訳設定',
	},
	options_tab_content_generic_translate_markReplacedElement: {
		message: '置き換え部分をマークする',
	},

	options_tab_content_generic_setting: {
		message: '設定ファイル',
	},
	options_tab_content_generic_setting_autoUpdate: {
		message: '自動更新を行う',
	},
	options_tab_content_generic_setting_periodDays: {
		message: '自動更新期間(日)',
	},

	options_tab_content_generic_save: {
		message: '保存',
	},

	options_tab_header_defines: {
		message: '定義ファイル一覧',
	},
	options_tab_content_defines_item_update: {
		message: '更新',
	},
	options_tab_content_defines_item_updating: {
		message: '更新中',
	},
	options_tab_content_defines_item_name: {
		message: '設定名',
	},
	options_tab_content_defines_item_version: {
		message: '設定バージョン',
	},
	options_tab_content_defines_item_updatedTimestamp: {
		message: '最終更新日時(UTC)',
	},
	options_tab_content_defines_item_id: {
		message: 'ID',
	},
	options_tab_content_defines_item_delete: {
		message: '削除',
	},
	options_tab_content_defines_item_website: {
		message: 'Webサイト',
	},
	options_tab_content_defines_item_repository: {
		message: 'リポジトリ',
	},
	options_tab_content_defines_item_document: {
		message: 'ドキュメント',
	},
	options_tab_content_defines_item_hosts: {
		message: '有効ホスト一覧',
	},
	options_tab_content_defines_item_details: {
		message: '詳細',
	},
	options_tab_content_defines_item_details_updateUrl: {
		message: 'アップデートURL',
	},
	options_tab_content_defines_item_details_website: {
		message: 'ウェブサイト',
	},
	options_tab_content_defines_item_details_repository: {
		message: 'リポジトリ',
	},
	options_tab_content_defines_item_details_document: {
		message: 'ドキュメント',
	},

	options_tab_content_defines_import: {
		message: 'インポート',
	},

	options_import_message: {
		message: 'インポートURL',
	},
	options_import_log_start: {
		message: 'インポート開始',
	},
	options_import_log_success: {
		message: 'インポート正常終了',
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
	}

};

export default messages;
