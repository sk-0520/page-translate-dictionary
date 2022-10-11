import * as config from '../config';
import * as host from '../host';
import * as logging from '../logging';

const logger = logging.create('page-content');

const confItems: Array<config.ISiteConfiguration> = [
	{
		host: 'github\\.com',
		name: 'test',
		version: '0',
		level: 0,
		language: 'ja-JP',
		path: {
			"\\w+/\\w+": {
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
			}
		},
		common: {
			selector: {
			},
			text: {
			}
		},
	}
];

const currentConfItems = confItems.filter(i => host.isEnabledHost(location.hostname, i.host));
if (currentConfItems.length) {
	logger.trace('きた！');
	const sortedCurrentConfItems = currentConfItems.sort((a,b) => a.level - b.level);
	for(const config of sortedCurrentConfItems) {
		transfer(config);
	}
} else {
	logger.trace('むし！');
}

function transfer(site: config.ISiteConfiguration): void
{

}
