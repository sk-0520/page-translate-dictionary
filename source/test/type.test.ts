import * as type from '../scripts/app/type';

describe('type', () => {
	test('hasPrimaryProperty', () => {
		expect(type.hasPrimaryProperty({}, 'a', 'number')).toBe(false);
		expect(type.hasPrimaryProperty({ a: undefined }, 'a', 'number')).toBe(false);
		expect(type.hasPrimaryProperty({ a: null }, 'a', 'number')).toBe(false);
		expect(type.hasPrimaryProperty({ a: 1 }, 'a', 'number')).toBe(true);
		expect(type.hasPrimaryProperty({ A: 1 }, 'a', 'number')).toBe(false);
		expect(type.hasPrimaryProperty({ a: '1' }, 'a', 'number')).toBe(false);
	});
});
