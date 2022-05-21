import { formatFileSize } from './format-file-size';

describe('formatFileSize', () => {
    it('Should format file size', () => {
        expect(formatFileSize(32143332)).toBe('30.7 MB');
        expect(formatFileSize(8904869085)).toBe('8.3 GB');
    });
});
