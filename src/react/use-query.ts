import { ApiMethod } from './types';
import { useCallback, useEffect, useState } from 'react';
import { useCompareMemo } from './use-compare-memo';

export interface QueryState<T> {
    data: T | undefined;
    loading: boolean;
    error: unknown | undefined;
    refetch: () => Promise<void>;
}

export function useQuery<TReq, TRes>(method: ApiMethod<TReq, TRes>, request: TReq): QueryState<TRes> {
    const [data, setData] = useState<TRes | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(undefined);

    // memoize the request based on structural equality so that we don't re-create hooks on every render
    // only when the properties inside the request change.
    request = useCompareMemo(request);

    const execute = useCallback(async () => {
        setLoading(true);
        try {
            setData(await method(request));
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [method, request, setLoading, setData, setError]);

    useEffect(() => {
        (async () => {
            try {
                await execute();
            } catch {
                // we ignore the error here in the effect error is stored in the state instead.
                // the reason "execute()" throws is so that errors during a "refetch()" bubble up to the caller as expected.
            }
        })();
    }, [execute]);

    return {
        data,
        loading,
        error,
        refetch: execute
    };
}
