import { AsyncFunction, RateLimiterState, RateLimitOptions } from './types';
import { withConcurrencyLimit } from './with-concurrency-limit';
import { clone } from 'lodash';
import { sleep } from './sleep';

export function withRateLimit<T extends AsyncFunction<any>>(options: RateLimitOptions, callback: T): T {
    const state: RateLimiterState = {
        lastCallTime: new Date(0)
    };

    const fn = withConcurrencyLimit(1, async (...args: any[]) => {
        await options.rateLimiter(clone(state));
        state.lastCallTime = new Date();
        return callback(...args);
    });

    return fn as T;
}

export function rateLimiterFixedRate(eventsPerSecond: number): RateLimitOptions['rateLimiter'] {
    return async (state) => {
        const now = new Date();
        const secondsSinceLastCall = (now.getTime() - state.lastCallTime.getTime()) / 1000;

        // wait time will be the fixed rate per second minus the time since the last call
        const waitTime = 1 / eventsPerSecond - secondsSinceLastCall;

        if (waitTime > 0) {
            await sleep(waitTime);
        }
    };
}
