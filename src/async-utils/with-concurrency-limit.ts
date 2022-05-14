import { AsyncFunction } from './types';

export function withConcurrencyLimit<T extends AsyncFunction<any>>(limit: number, callback: T): T {
    const pendingCalls = new Set<Promise<T>>();

    const fn = async (...args: []) => {
        // sit in a wait loop until there's space for another concurrent call to be started.
        while (pendingCalls.size >= limit) {
            try {
                await Promise.race(pendingCalls);
            } catch {
                // we ignore errors from Promise.race because
                // they are errors thrown by other calls to the wrapper callback.
            }
        }

        // call the callback and take a reference to the promise so that we can add it to the list of pending calls.
        const promise = callback(...args);
        pendingCalls.add(promise);

        try {
            // return the result of the promise (allow exceptions for this call to bubble)
            return await promise;
        } finally {
            // finally remove the promise from the pending calls array
            pendingCalls.delete(promise);
        }
    };

    return fn as T;
}
