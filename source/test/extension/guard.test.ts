import * as guard from "../../scripts/extension/guard";

describe('guard', () => {
	test.each([
		[false, {}],
		[false, {
			markReplacedElement: 1
		}],
		[false, {
			markReplacedElement: '1'
		}],
		[false, {
			markReplacedElement_: true
		}],
		[true, {
			markReplacedElement: true
		}],
	])('isTranslateConfiguration', (expected: boolean, obj: unknown) => {
		expect(guard.isTranslateConfiguration(obj)).toBe(expected);
	});
});
