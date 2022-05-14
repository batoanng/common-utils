import { AsyncFunction, ExponentialBackoffOptions, RetryOptions } from './types';
import { sleep } from './sleep';

export function withRetry<TResult, T extends AsyncFunction<TResult>>(options: RetryOptions<TResult>, callback: T): T {
    let attempt = 1;
    const shouldRetry = options.when;
    const backoff = options.backoff();

    const fn = async (...args: unknown[]): Promise<any> => {
        try {
            const result = await callback(...args);

            // if we hit the max attempts we will return
            // the result because we cannot retry anymore
            if (attempt >= options.attempts) {
                return result;
            }

            // check if we need to retry the result
            if (await shouldRetry(undefined, result, args)) {
                // await the retry backoff
                await backoff();

                // try again
                attempt++;
                return await fn(...args);
            }

            // return the result if we don't need to retry
            return result;
        } catch (err) {
            if (attempt >= options.attempts) {
                // re-throw if we cannot retry anymore
                throw err;
            }

            if (!(await shouldRetry(err, undefined, args))) {
                throw err;
            }

            // await the retry backoff
            await backoff();

            // try again
            attempt++;
            return await fn(...args);
        }
    };

    return fn as T;
}

export function backoffFixed(durationSeconds: number): RetryOptions['backoff'] {
    return () => async () => {
        await sleep(durationSeconds);
    };
}

export function backoffExponential(options: ExponentialBackoffOptions): RetryOptions['backoff'] {
    return () => {
        let attempts = 0;
        let backoff = 0;

        return async () => {
            attempts++;
            backoff = backoff + options.initialSeconds * attempts;
            backoff = Math.min(backoff, options.maxSeconds);
            await sleep(backoff);
        };
    };
}
