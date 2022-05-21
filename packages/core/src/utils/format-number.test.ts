import { formatNumber } from './format-number';

describe('formatNumber', () => {
    it('Should format number', () => {
        expect(formatNumber(389210)).toBe('389.2K');
    });
});
