export class Lock {
    private promise = Promise.resolve();

    /**
     * acquire waits for the lock and then executes the provided
     * callback ensuring the lock is released after the callback completes
     *
     * example:
     *
     * const lock = new Lock();
     *
     * //..
     *
     * await lock.acquire(() => {
     *     // critical section
     * });
     *
     * @param callback an async function that can optionally return a value
     * @returns the value returned by the async callback
     */

    acquire<T = void>(callback: () => Promise<T>): Promise<T> {
        const result = this.promise.then(callback);
        this.promise = result.then(() => undefined).catch(() => undefined);
        return result;
    }
}
