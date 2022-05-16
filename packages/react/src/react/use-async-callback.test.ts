import { act, renderHook } from '@testing-library/react-hooks';
import { AsyncCallbackState, useAsyncCallback } from './use-async-callback';

describe('useAsyncCallback', () => {
    it('should return a function with associated async state', async () => {
        const fn = jest.fn(async (input: string) => {
            return input;
        });

        const hook = renderHook(() => useAsyncCallback(fn, []));

        const [callback1, state1] = hook.result.current;
        expect(callback1).toStrictEqual(expect.any(Function));
        expect(state1).toStrictEqual<AsyncCallbackState<string>>({
            called: false,
            data: undefined,
            error: undefined,
            loading: false,
            reset: expect.any(Function)
        });

        // call the async callback (but do not await yet)
        let promise!: Promise<string>;
        act(() => {
            promise = callback1('test input');
        });

        const [callback2, state2] = hook.result.current;
        expect(callback2).toStrictEqual(expect.any(Function));
        expect(state2).toStrictEqual<AsyncCallbackState<string>>({
            called: true,
            data: undefined,
            error: undefined,
            loading: true,
            reset: expect.any(Function)
        });

        // wait for the async call to complete
        await act(async () => {
            await promise;
        });

        const [callback3, state3] = hook.result.current;
        expect(callback3).toStrictEqual(expect.any(Function));
        expect(state3).toStrictEqual<AsyncCallbackState<string>>({
            called: true,
            data: 'test input',
            error: undefined,
            loading: false,
            reset: expect.any(Function)
        });
    });

    it('should set error in async state', async () => {
        const error = new Error('boom');
        const fn = jest.fn(async (input: string) => {
            throw error;
        });
        const hook = renderHook(() => useAsyncCallback(fn, []));

        await act(async () => {
            try {
                await hook.result.current[0]('test input');
            } catch {}
        });

        expect(hook.result.current[1]).toStrictEqual<AsyncCallbackState<string>>({
            called: true,
            data: undefined,
            error,
            loading: false,
            reset: expect.any(Function)
        });
        expect(Object.is(hook.result.current[1].error, error)).toBe(true);
    });

    it('should allow async state to be reset()', async () => {
        const fn = jest.fn(async (input: string) => {
            return input;
        });
        const hook = renderHook(() => useAsyncCallback(fn, []));

        await act(async () => {
            await hook.result.current[0]('test input');
        });

        expect(hook.result.current[1]).toStrictEqual<AsyncCallbackState<string>>({
            called: true,
            data: 'test input',
            error: undefined,
            loading: false,
            reset: expect.any(Function)
        });

        await act(async () => {
            await hook.result.current[1].reset();
        });

        expect(hook.result.current[1]).toStrictEqual<AsyncCallbackState<string>>({
            called: false,
            data: undefined,
            error: undefined,
            loading: false,
            reset: expect.any(Function)
        });
    });
});
