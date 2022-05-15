/**
 * This is an implementation of lodash's memoize function
 * except it will memoize a function call based on all function arguments
 *
 * lodash's memoize will only consider the first function argument.
 *
 * The implementation has been adapted from here:
 * https://github.com/lodash/lodash/issues/2115#issuecomment-1019582176
 *
 * @param func
 * @returns func
 */
export function memoize<T extends Function>(func: T): T {
    const cache = new Map();

    const memoized = (...args: any) => {
        let innerCache = cache;
        for (let i = 0; i < func.length - 1; i++) {
            const key = args[i];
            if (!innerCache.has(key)) {
                innerCache.set(key, new Map());
            }
            innerCache = innerCache.get(key);
        }
        const key = args[args.length - 1];
        if (innerCache.has(key)) {
            return innerCache.get(key);
        }

        const result = func(...args);
        innerCache.set(key, result);
        return result;
    };

    return memoized as unknown as T;
}
