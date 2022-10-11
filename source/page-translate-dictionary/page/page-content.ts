import * as config from '../config';
import * as url from '../url';
import * as logging from '../logging';

const logger = logging.create('page-content');

//　将来的にこの項目はストレージから引っ張るので無くなる
const confItems: Array<config.ISiteConfiguration> = [
	{
		host: 'github\\.com',
		name: 'test',
		version: '0',
		level: 0,
		language: 'ja-JP',
		path: {
			"/[A-Za-z0-9_\\-]+/[A-Za-z0-9_\\-]+/?$": {
				"selector": {
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
				"selector": {
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


function transfer(pathConfiguration: config.IPathConfiguration, siteConfiguration: config.ISiteConfiguration): void {
	for (const [selector, value] of Object.entries(pathConfiguration.selector)) {
		const element = document.querySelector(selector);
		if (!element) {
			continue;
		}
		console.debug(value);
	}
}

function execute() {
	const currentConfItems = confItems.filter(i => url.isEnabledHost(location.hostname, i.host));
	if (currentConfItems.length) {
		logger.trace('きた？');

		let isEnabled = false;
		const sortedCurrentConfItems = currentConfItems.sort((a, b) => a.level - b.level);
		for (const config of sortedCurrentConfItems) {
			for (const [pathPattern, value] of Object.entries(config.path)) {
				if (url.isEnabledPath(location.pathname, pathPattern)) {
					logger.trace('きた！！');
					isEnabled = true;
					transfer(value, config);
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

(function () {
	document.addEventListener('pjax:end', ev => update(ev));
	document.addEventListener('turbo:render', ev => update(ev));
	execute();
})();
