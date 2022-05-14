import { AsyncFunction } from './types';

export function withErrorIntercept<T extends AsyncFunction<any>>(interceptor: (error: unknown) => Promise<unknown>, callback: T): T {
    const fn = async (...args: any[]) => {
        try {
            return await callback(...args);
        } catch (err) {
            throw await interceptor(err);
        }
    };

    return fn as T;
}
