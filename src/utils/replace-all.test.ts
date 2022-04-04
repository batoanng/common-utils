import { replaceAll } from './replace-all';

describe('replaceAll', () => {
    it('Will replace all values', () => {
        const dummyString = 'Hello, nice to meet you!';
        expect(replaceAll(dummyString, ',', '')).toBe('Hello nice to meet you!');
    });
});
