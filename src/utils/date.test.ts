import { dateToIsoDate } from './date';

describe('dateToIsoDate', () => {
    it('Will transform date to ISO date', () => {
        expect(dateToIsoDate('01/04/2022')).toBe('2022-04-01T00:00:00.000Z');
    });
});
