import { errorText } from './error-text';

describe('errorText', () => {
    it('Should handle error strings', () => {
        expect(errorText('boom')).toBe('Boom.');
    });

    it('Should handle standard error objects', () => {
        expect(errorText(new Error('boom'))).toBe('Boom.');
    });
});
