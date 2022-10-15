import * as config from '../config';
import * as url from '../url';
import * as logging from '../logging';
import * as translator from './translator';
import * as names from '../names';
import * as storage from '../storage';
import '../../styles/page.scss';

const logger = logging.create('page-content');

function executeCore() {
	const currentSiteConfigurations = siteConfigurations.filter(i => url.isEnabledHost(location.hostname, i.host));
	if (currentSiteConfigurations.length) {
		logger.trace('きた？');

		let isTranslated = false;
		const sortedCurrentSiteConfigurations = currentSiteConfigurations.sort((a, b) => a.level - b.level);
		for (const siteConfiguration of sortedCurrentSiteConfigurations) {
			for (const [pathPattern, pathConfiguration] of Object.entries(siteConfiguration.path)) {
				if (url.isEnabledPath(location.pathname, pathPattern)) {
					logger.trace('きた！！', pathPattern);
					isTranslated = true;
					translator.translate(pathConfiguration, siteConfiguration, applicationConfiguration.translate);
				}
			}
		}
		if (!isTranslated) {
			logger.trace('きてない・・・', location.pathname);
		}
	} else {
		logger.trace('無視！');
	}
}

function createProgressElement(): HTMLElement {
	const progressElement = document.createElement('div');
	progressElement.classList.add(names.ClassNames.progress)

	progressElement.appendChild(
		document.createTextNode('置き換え中...')
	);

	return progressElement;
}

function execute() {
	const progressElement = createProgressElement();
	document.body.appendChild(progressElement);
	try {
		executeCore();
	} finally {
		document.body.removeChild(progressElement);
	}
}

function update(event: Event) {
	logger.info('update');
	execute();
}

export function boot() {
	document.addEventListener('pjax:end', ev => update(ev));
	document.addEventListener('turbo:render', ev => update(ev));

	storage.loadApplicationAsync();
	storage.loadSiteHeadsAsync();

	execute();
}
