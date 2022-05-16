import { withErrorIntercept } from './with-error-intercept';
import { backoffFixed, withRetry } from './with-retry';

describe('withErrorIntercept', () => {
    it('should call the interceptor when promise throws', async () => {
        const fetcher = jest.fn().mockRejectedValue(new Error('mock-result'));
        const interceptor = jest.fn(async (error: unknown) => error);
        const fn = withErrorIntercept(interceptor, fetcher);

        // act
        const promse = fn();

        // assert
        await expect(promse).rejects.toThrow(new Error('mock-result'));
        expect(interceptor).toHaveBeenCalledTimes(1);
    });

    it('should reject with the error returned by the interceptor', async () => {
        const fetcher = jest.fn().mockRejectedValue(new Error('mock-result'));
        const interceptor = jest.fn(async (error: unknown) => new Error('interceptor-error'));
        const fn = withErrorIntercept(interceptor, fetcher);

        // act
        const promise = fn();

        // assert
        await expect(promise).rejects.toThrow(new Error('interceptor-error'));
    });

    it('should not call the interceptor if the promise does n ot reject', async () => {
        const fetcher = jest.fn().mockResolvedValue('success');
        const interceptor = jest.fn(async (error: unknown) => error);
        const fn = withErrorIntercept(interceptor, fetcher);

        // act
        const promise = fn();

        // assert
        await expect(promise).resolves.toEqual('success');
        expect(interceptor).not.toHaveBeenCalled();
    });

    it('can compose the error interceptor and withRetry', async () => {
        const fetcher = jest.fn().mockRejectedValue(new Error('boom'));
        const interceptor = jest.fn((error: unknown) => Promise.resolve(error));
        const when = jest.fn((error) => true);

        let fn = withErrorIntercept(interceptor, fetcher);
        fn = withRetry(
            {
                attempts: 10,
                backoff: backoffFixed(0),
                when
            },
            fn
        );

        const promise = fn();

        // assert
        await expect(promise).rejects.toThrow(new Error('boom'));
        expect(interceptor).toHaveBeenCalled();
        expect(when).toHaveBeenCalled();
    });
});
