import * as config from "../../scripts/extension/config";

describe('config', () => {
	test('toInternalId', () => {
		expect(config.toInternalId('a')).toBe('a');
		expect(() => config.toInternalId('')).toThrowError(Error);
	});

	test('createSiteConfiguration', () => {
		const head: config.SiteHeadConfiguration = {
			id: config.toInternalId('id'),
			isEnabled: true,
			updatedTimestamp: 'updatedTimestamp',
			lastCheckedTimestamp: 'lastCheckedTimestamp',
			name: 'name',
			version: 'version',
			updateUrl: 'updateUrl',
			information: {
				websiteUrl: 'websiteUrl',
				repositoryUrl: 'repositoryUrl',
				documentUrl: 'documentUrl',
			},
			language: 'language',
			hosts: [
				'www'
			],
			priority: 0,
		};
		const body: config.SiteBodyConfiguration = {
			path: {},
			common: {},
			watch: {},
		};

		const site = config.createSiteConfiguration(head, body);
		expect(site.id).toBe(head.id);
		expect(site.updatedTimestamp).toBe(head.updatedTimestamp);
		expect(site.lastCheckedTimestamp).toBe(head.lastCheckedTimestamp);
		expect(site.name).toBe(head.name);
		expect(site.version).toBe(head.version);
		expect(site.updateUrl).toBe(head.updateUrl);
		expect(site.information.websiteUrl).toBe(head.information.websiteUrl);
		expect(site.information.repositoryUrl).toBe(head.information.repositoryUrl);
		expect(site.information.documentUrl).toBe(head.information.documentUrl);
		expect(site.language).toBe(head.language);
		expect(site.hosts).toEqual(head.hosts);
		expect(site.priority).toBe(head.priority);
	});
});
