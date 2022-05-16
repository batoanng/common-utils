import { ApiMethod } from './types';
import { useAsyncCallback } from './use-async-callback';

export interface MutationState<TRes> {
    data: TRes | undefined;
    loading: boolean;
    error: unknown | undefined;
    called: boolean;
    reset: () => void;
}

// just a type alias
export type Mutation<TReq, TRes> = ApiMethod<TReq, TRes>;

export function useMutation<TReq, TRes>(method: ApiMethod<TReq, TRes>): [Mutation<TReq, TRes>, MutationState<TRes>] {
    return useAsyncCallback(
        async (request: TReq) => {
            return await method(request);
        },
        [method]
    );
}
