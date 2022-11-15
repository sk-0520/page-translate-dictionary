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
		[false, {
			markReplacedElement: true
		}],
		[false, {
			translate: {
			}
		}],
		[false, {
			_translate: {
				markReplacedElement: true
			}
		}],
		[false, {
			translate: {
				markReplacedElement: 1
			}
		}],
		[true, {
			translate: {
				markReplacedElement: true
			}
		}],
	])('isApplicationConfiguration', (expected: boolean, obj: unknown) => {
		expect(guard.isApplicationConfiguration(obj)).toBe(expected);
	});
});
