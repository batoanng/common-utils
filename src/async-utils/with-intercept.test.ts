import { withIntercept } from './with-intercept';

describe('withIntercept', () => {
    it('should intercept call results', async () => {
        const fetcher = jest.fn().mockResolvedValue('mock-result');
        const interceptor = jest.fn().mockResolvedValue('intercepted-result');
        const fn = withIntercept(interceptor, fetcher);

        const result = await fn();

        expect(fetcher).toHaveBeenCalledTimes(1);
        expect(interceptor).toHaveBeenCalledTimes(1);
        expect(interceptor).toHaveBeenCalledWith('mock-result');
        expect(result).toEqual('intercepted-result');
    });
});
