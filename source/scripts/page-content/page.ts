import * as config from '../config';
import * as url from '../url';
import * as logging from '../logging';
import * as translator from './translator';

const logger = logging.create('page-content');

//　将来的にこの項目はストレージから引っ張るので無くなる
const confItems: Array<config.ISiteConfiguration> = [
	{
		host: 'content-type-text\\.net',
		name: 'content-type-text.net',
		version: '0',
		level: 0,
		language: 'ja-JP',
		path: {
			"/": {
				selector: {
					"h1": {
						text: {
							replace: {
								mode: config.ReplaceMode.Normal,
								value: "test",
							}
						}
					},
					"li:nth-child(1) a": {
						text: {
							replace: {
								mode: config.ReplaceMode.Common,
								value: "ABC",
							}
						}
					},
					"li:nth-child(2) a:nth-child(1)": {
						text: {
							match: {
								pattern: "Pe"
							},
							replace: {
								mode: config.ReplaceMode.Normal,
								value: "PE",
							}
						}
					},
					"li:nth-child(2) li:nth-child(2) a": {
						text: {
							match: {
								mode: config.MatchMode.Regex,
								pattern: "(?<HEAD>.+)(?<VALUE>r)(?<TAIL>.+)"
							},
							replace: {
								mode: config.ReplaceMode.Normal,
								value: "💩<${HEAD}>!<VALUE>!<${TAIL}>",
							}
						}
					},
				}
			}
		},
		"common": {
			text: {
				"ABC": "aaaaaaa"
			}
		}
	},
	{
		host: 'github\\.com',
		name: 'test',
		version: '0',
		level: 0,
		language: 'ja-JP',
		path: {
			"/[A-Za-z0-9_\\-]+/[A-Za-z0-9_\\-]+/?$": {
				selector: {
					"h1": {
						text: {
							replace: {
								mode: config.ReplaceMode.Normal,
								value: "test",
							}
						}
					}
				}
			},
			"/[A-Za-z0-9_\\-]+/[A-Za-z0-9_\\-]+/issue": {
				selector: {
					"h1": {
						text: {
							replace: {
								mode: config.ReplaceMode.Normal,
								value: "test",
							}
						}
					}
				}
			},
		},
		common: {
			selector: {
			},
			text: {
			}
		},
	}
];

function execute() {
	const currentConfItems = confItems.filter(i => url.isEnabledHost(location.hostname, i.host));
	if (currentConfItems.length) {
		logger.trace('きた？');

		let isEnabled = false;
		const sortedCurrentConfItems = currentConfItems.sort((a, b) => a.level - b.level);
		for (const config of sortedCurrentConfItems) {
			for (const [pathPattern, value] of Object.entries(config.path)) {
				if (url.isEnabledPath(location.pathname, pathPattern)) {
					logger.trace('きた！！', pathPattern);
					isEnabled = true;
					translator.translate(value, config);
				}
			}
		}
		if (!isEnabled) {
			logger.trace('きてない・・・', location.pathname);
		}
	} else {
		logger.trace('無視！');
	}
}

function update(event: Event) {
	logger.info('update');
	execute();
}

export function boot()
{
	document.addEventListener('pjax:end', ev => update(ev));
	document.addEventListener('turbo:render', ev => update(ev));
	execute();
}
