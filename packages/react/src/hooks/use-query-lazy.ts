import { ApiMethod } from './types';
import { useCompareMemo } from './use-compare-memo';
import { useAsyncCallback } from './use-async-callback';

export interface LazyQueryState<T> {
    data: T | undefined;
    loading: boolean;
    error: unknown | undefined;
    called: boolean;
    reset: () => void;
}

export type Loader<TReq, TRes> = (request?: TReq) => Promise<TRes>;

export function useQueryLazy<TReq, TRes>(method: ApiMethod<TReq, TRes>, request?: TReq): [Loader<TReq, TRes>, LazyQueryState<TRes>] {
    // memoize the request based on structural equality so that we don't re-create hooks on every render
    // only when the properties inside the request change.
    request = useCompareMemo(request);

    return useAsyncCallback(
        async (requestOverride?: TReq) => {
            const req = requestOverride ?? request;
            if (!req) {
                throw new Error('useQueryLazy expects a request object to passed to the hook or loader function but neither were provided');
            }
            return await method(req);
        },
        [method, request]
    );
}
