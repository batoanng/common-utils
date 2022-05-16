import { AsyncFunction, Awaited } from './types';

export function withIntercept<T extends AsyncFunction<any>>(interceptor: (value: Awaited<ReturnType<T>>) => ReturnType<T>, callback: T): T {
    const fn = async (...args: any[]) => {
        return await interceptor(await callback(...args));
    };

    return fn as T;
}
