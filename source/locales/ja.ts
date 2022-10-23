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
