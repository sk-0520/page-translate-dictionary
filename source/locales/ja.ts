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
};

export default messages;
