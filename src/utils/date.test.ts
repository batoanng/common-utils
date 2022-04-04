import { dateToIsoDate, isIsoDateValid } from './date';

describe('date-utils', () => {
    describe('dateToIsoDate', () => {
        it('Will transform date to ISO date', () => {
            expect(dateToIsoDate('01/04/2022')).toBe('2022-04-01T00:00:00.000Z');
        });
    });

    describe('isIsoDateValid', () => {
        it('Will return true with valid date', () => {
            expect(isIsoDateValid('01/04/2022')).toBeTruthy();
        });

        it('Will return false with invalid date', () => {
            expect(isIsoDateValid('Invalid date')).toBeFalsy();
        });

        it('Will return false with undefined', () => {
            expect(isIsoDateValid(undefined)).toBeFalsy();
        });
    });
});
