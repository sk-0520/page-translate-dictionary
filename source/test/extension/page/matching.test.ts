import * as matching from '../../../scripts/extension/page/matching';
import * as config from '../../../scripts/extension/config';

const siteId: config.SiteId = {
	id: 'test',
	name: 'test',
};

describe('matching', () => {
	test('match', () => {
		const result = matching.match('a', {
			pattern: 'a',
			mode: config.MatchMode.Forward,
			ignoreCase: false,
			replace: {
				mode: config.ReplaceMode.Normal,
				regex: new Map(),
				value: 'A'
			}
		}, siteId);

		expect(result.isRegex).toBeFalsy();
		expect(result.matched).toBeTruthy();
	});
});
