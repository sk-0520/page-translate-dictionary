import Wildcard from '../scripts/wildcard';

describe('Wildcard', () => {
	test('test', () =>{
		expect(Wildcard.test('', '')).toBe(true);
		expect(Wildcard.test('', '*')).toBe(true);
		expect(Wildcard.test('', '?')).toBe(false);
		expect(Wildcard.test('abcde', '*bcd*')).toBe(true);
	});
});
