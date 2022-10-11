import * as config from '../config';

const conf: config.ISiteConfiguration = {
	domain: 'github.com',
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
};

console.dir(conf);
