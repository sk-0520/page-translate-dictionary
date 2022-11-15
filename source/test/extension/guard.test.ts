import * as guard from "../../scripts/extension/guard";

describe('guard', () => {
	test.each([
		[false, {}],
	])('isTranslateConfiguration', (expected: boolean, obj: unknown) => {
		expect(guard.isTranslateConfiguration(obj)).toBe(expected);
	});
});
