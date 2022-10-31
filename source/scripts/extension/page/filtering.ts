import * as config from '../config';

export function filter(input: string, filterConfiguration: config.FilterConfiguration, siteId:config.SiteId): string {


	if(filterConfiguration.trim) {
		return input.trim();
	}

	return input;
}
