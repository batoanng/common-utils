import { ApiMethod } from './types';
import { DependencyList, useCallback, useState } from 'react';

export interface AsyncCallbackState<T> {
    data: T | undefined;
    loading: boolean;
    error: undefined | unknown;
    called: boolean;
    reset: () => void;
}

export function useAsyncCallback<TReq, TRes>(method: ApiMethod<TReq, TRes>, deps: DependencyList): [ApiMethod<TReq, TRes>, AsyncCallbackState<TRes>] {
    const [data, setData] = useState<TRes | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(undefined);
    const [called, setCalled] = useState(false);

    const callback = useCallback(
        async (request: TReq) => {
            setCalled(true);
            setLoading(true);
            setError(undefined);
            try {
                const result = await method(request);
                setData(result);
                return result;
            } catch (error) {
                setError(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [setCalled, setLoading, setError, setData, ...deps]
    );

    const reset = useCallback(() => {
        setData(undefined);
        setLoading(false);
        setError(undefined);
        setCalled(false);
    }, [setCalled, setLoading, setError, setData]);

    return [
        callback,
        {
            data,
            loading,
            error,
            called,
            reset
        }
    ];
}
