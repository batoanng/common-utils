import { Lock } from './lock';

describe('lock', () => {
    it('should call the callback when the lock is free', async () => {
        const callback = jest.fn().mockReturnValue(Promise.resolve());
        const lock = new Lock();
        await lock.acquire(async () => {
            /* eslint-disable no-return-await */
            return await callback();
        });

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call when the lock is already acquired', async () => {
        const callback1 = jest.fn().mockReturnValue(Promise.resolve());
        const callback2 = jest.fn().mockReturnValue(Promise.resolve());

        const lock = new Lock();

        // acquire once
        const acquirePromise1 = lock.acquire(async () => {
            await Promise.resolve(); // bump the JS event loop
            /* eslint-disable no-return-await */
            return await callback1();
        });

        // acquire again
        const acquirePromise2 = lock.acquire(async () => {
            await Promise.resolve(); // bump the JS event loop
            /* eslint-disable no-return-await */
            return await callback2();
        });

        // pre-assertion:
        // the callback aren't called yet because we haven't awaited the promises
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();

        // wait for the first lock acquisition to complete
        // and assert that only callback1 has executed
        await acquirePromise1;
        expect(callback1).toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();

        // then wait for the second lock acquisition to complete
        // and assert that callback2 has also executed
        await acquirePromise2;
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
    });
});
