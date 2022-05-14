import { backoffFixed, RetryOptions, withRetry } from './with-retry';

describe('withRetry', () => {
    let count = 0;

    const spy = jest.fn(() => {
        return count++;
    });

    const fetcher = jest.fn(async () => {
        // simulate an async API call
        await Promise.resolve();

        // call the spy so that tests can assert
        // number of calls and result values
        // after the async operation
        return spy();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        count = 0;
    });

    it('should retry the callback if it false', async () => {
        const failed = jest.fn();
        const succeeded = jest.fn();

        const options: RetryOptions = {
            attempts: Infinity,
            backoff: backoffFixed(0),
            when: (error) => error !== undefined
        };

        const callback = withRetry(options, async () => {
            const value = await fetcher();

            // make the first call throw an error
            if (value !== 4) {
                failed();
                throw new Error('error');
            }

            // all other calls will succeed
            succeeded();
            return value;
        });

        const result = await callback();

        // base on the callback failing
        // until the fetcher expect these calls
        // 0 error
        // 1 error
        // 2 error
        // 3 error
        // 4 success
        expect(failed).toHaveBeenCalledTimes(4);
        expect(succeeded).toHaveBeenCalledTimes(1);
        expect(fetcher).toHaveBeenCalledTimes(5);
        expect(result).toEqual(4);
    });

    it('should throw an error if the callback fails at the max attempts', async () => {
        const options: RetryOptions = {
            attempts: 2,
            backoff: backoffFixed(0),
            when: (error) => error !== undefined
        };

        const callback = withRetry(options, async () => {
            // the fetcher count up from 0
            // but we like to think of attempts starting
            // at 1 i.e. 1st attempt, 2nd attempt etc.
            // so we'll +1 to the value so that the count
            // matches numerically the attempts
            // (this doesn't change the test logic, just the values we expect)
            const value = await fetcher();
            throw new Error(`error ${value + 1}`);
        });

        const promise = callback();

        await expect(promise).rejects.toThrow(new Error(`error 2`));
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('should allow retrying base on a result', async () => {
        const options: RetryOptions = {
            attempts: 2,
            backoff: backoffFixed(0),
            when: (error, result) => result === 'please retry'
        };

        const fn = jest.fn().mockResolvedValue('please retry');

        const callback = withRetry(options, fn);

        await callback();

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
