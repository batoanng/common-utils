import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import { useCompareMemo } from './use-compare-memo';

describe('useCompareMemo', () => {
    it('should cache input reference until structural equality change', () => {
        // inout is the first argument passed to useCompareMemo() in this testcase.
        const input = {
            someProperty: 'hello world'
        };

        // render the hook so that we can assert it's result and test it's lifecycle in this testcase.
        const hook = renderHook(({ input }) => useCompareMemo(input), {
            initialProps: { input }
        });

        // the hook should return the given object and it should be the same reference that was passed
        // as the input argument (same memory reference).
        expect(Object.is(hook.result.current, input)).toBe(true);

        // now we make a copy of the input that we'll pass to the next render of the hook so that we can test,
        // that the hook correctly returns a stable reference.
        const nextInput = cloneDeep(input);

        // the next input must not be the same reference as the original input, i.e. it's copy
        expect(Object.is(input, nextInput)).toBe(false);

        // but the next input must be structurally equal to the original input, i.e. it's a copy
        expect(nextInput).toEqual(input);

        // re-render the hook with the next input i.e. a copy of the original input object
        hook.rerender({
            input: nextInput
        });

        // assert that the hook returns a reference to the original input and not a reference to the copy
        expect(Object.is(hook.result.current, input)).toBe(true);

        // how we can re-render the hook using a new object that is not structurally equal to check that
        // the hook returns the new object's reference.
        const changedInput = { someProperty: 'changed' };
        hook.rerender({
            input: changedInput
        });

        // the hook should have returned the new object because it was not equal to the original input
        expect(Object.is(hook.result.current, changedInput)).toBe(true);
    });
});
