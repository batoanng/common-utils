import { FetchFn, FetchRequestConfig, FetchRequestInit, FetchResponse, RateLimitOptions, RetryOptions } from './types';
import { rateLimiterFixedRate, withRateLimit } from './with-rate-limit';
import { backoffExponential, withRetry } from './with-retry';
import { CustomError } from '../errors/custom-error';
import { ApiBadRequestError } from '../errors/api-bad-request-error';
import { ApiUnauthorizedError } from '../errors/api-unauthorized-error';
import { ApiForbiddenError } from '../errors/api-forbidden-error';
import { ApiNetworkError } from '../errors/api-network-error';
import { ApiNotFoundError } from '../errors/api-not-found-error';
import { ApiRequestTimeoutError } from '../errors/api-request-timeout-error';
import { ApiConflictError } from '../errors/api-conflict-error';
import { ApiUnprocessableEntityError } from '../errors/api-unprocessable-entity-error';
import { ApiTooManyRequestsError } from '../errors/api-too-many-requests-error';
import { ApiInternalError } from '../errors/api-internal-error';
import { ApiServiceUnavailableError } from '../errors/api-service-unavailable-error';
import { ApiGatewayTimeoutError } from '../errors/api-gateway-timeout-error';
import { withErrorIntercept } from './with-error-intercept';
import { withIntercept } from './with-intercept';

export const defaultRateLimitOptions: RateLimitOptions = {
    // 1 request per second
    rateLimiter: rateLimiterFixedRate(1)
};

/**
 * defaultCanRetryRequest is the default logic that decides if a request can be retried after a failure.
 * defaultCanRetryRequest will return true for GET request only
 * @param url
 * @param init
 */
export function defaultCanRetryRequest(url: string, init?: FetchRequestInit): boolean {
    const method = init?.method ?? 'GET';

    return method.toUpperCase() === 'GET';
}

export async function transformFetchResponse(response: FetchResponse): Promise<FetchResponse | CustomError> {
    if (response.status >= 400) {
        let message = '';

        if (response.headers.get('content-type')?.includes?.('application/json')) {
            const json = await response.json();
            if (typeof json === 'object') {
                message = json?.message ?? '';
            }
        } else {
            message = await response.text();
        }

        let apiError: CustomError;
        switch (response.status) {
            case 400:
                apiError = new ApiBadRequestError(message);
                break;
            case 401:
                apiError = new ApiUnauthorizedError();
                break;
            case 403:
                apiError = new ApiForbiddenError();
                break;
            case 404:
                apiError = new ApiNotFoundError();
                break;
            case 408:
                apiError = new ApiRequestTimeoutError();
                break;
            case 409:
                apiError = new ApiConflictError();
                break;
            case 422:
                apiError = new ApiUnprocessableEntityError();
                break;
            case 429:
                apiError = new ApiTooManyRequestsError();
                break;
            case 500:
                apiError = new ApiInternalError();
                break;
            case 503:
                apiError = new ApiServiceUnavailableError();
                break;
            case 504:
                apiError = new ApiGatewayTimeoutError();
                break;
            default:
                apiError = new ApiNetworkError();
        }
        return apiError;
    }

    return response;
}

export const defaultRetryOptions: RetryOptions<FetchResponse> = {
    attempts: 4,
    backoff: backoffExponential({
        initialSeconds: 1,
        maxSeconds: 4
    }),
    when: async (error, response, callParameters): Promise<boolean> => {
        if (!defaultCanRetryRequest(callParameters[0], callParameters[1])) {
            return false;
        }

        if (response) {
            error = await transformFetchResponse(response);
        }

        if (error instanceof ApiNetworkError) {
            return true;
        }
        if (error instanceof ApiTooManyRequestsError) {
            return true;
        }
        if (error instanceof ApiServiceUnavailableError) {
            return true;
        }
        if (error instanceof ApiGatewayTimeoutError) {
            return true;
        }
        return false;
    }
};

async function httpStatusInterceptor(response: FetchResponse) {
    const transformed = await transformFetchResponse(response);

    if (transformed instanceof CustomError) {
        throw transformed;
    }

    return transformed;
}

async function fetchErrorInterceptor(error: unknown): Promise<unknown> {
    if (error && typeof error === 'object' && 'message' in error) {
        const { message } = error as any;

        const knownNetworkErrorMessages = [
            'Network error when attempting to fetch resource.', // firefox
            'Failed to fetch', // chrome
            'Load failed' // safari
        ];

        if (knownNetworkErrorMessages.some((msg) => message === msg)) {
            return new ApiNetworkError(message);
        }
    }
}

export interface ClientOptions {
    fetch: FetchFn;

    /**
     * baseUrl configures a default base url for all the fetch requests.
     */
    baseUrl?: string | (() => string);

    /**
     * default request headers.
     */
    headers?: () => Promise<Record<string, string>> | Record<string, string>;

    /**
     * default config options for all the fetch requests.
     */
    fetchOptions?: FetchRequestConfig;

    /**
     * retry options can be configured
     *
     * by default an exponential backoff with 4 attempts is used.
     *
     * by default only the following errors will be retried:
     * - ApiTooManyRequestsError
     * - ApiGatewayTimeoutError
     * - ApiServiceUnavailableError
     * - ApiNetworkError
     *
     * retry logic can be disabled by passing `false`
     */
    retry?: Partial<RetryOptions<FetchResponse>> | false;

    /**
     * rate limit can be configured.
     *
     * by default a fixed rate limit of 1 request/second is used.
     *
     * rate limit logic can be disabled by passing `false`
     */
    rateLimit?: Partial<RateLimitOptions> | false;

    /**
     * disableErrorTransform can be set to `true` to disable all error transforming logic.
     *
     * if the error transforming logic is turned off then the client will not convert http error status codes
     * to throw ApiError object.
     *
     * this setting can be used to make the fetch() method more compatible with the legacy code paths that
     * expect to handle HTTP errors as responses rather than throw errors.
     *
     */
    disableErrorTransform?: boolean;
}

export class HttpClient {
    private readonly fetcher: FetchFn;

    constructor(private readonly options: ClientOptions) {
        this.fetcher = options.fetch;

        // if rateLimit options are not disabled, then wrap the fetch function with rate limiting logic
        if (options.rateLimit !== false) {
            // rate limit logic ensures the fetch function can only be called as quickly as the rate limiter options allow.
            this.fetcher = withRateLimit({ ...defaultRateLimitOptions, ...options.rateLimit }, this.fetcher);
        }

        if (!options.disableErrorTransform) {
            // wrap the fetcher with an error interceptor that can handle errors thrown by the fetch function.
            // fetch() only throws errors relating to invalid argument and network conditions i.e. "ECONNRESET"
            // http status codes are valid responses and are not thrown by fetch()
            this.fetcher = withErrorIntercept(fetchErrorInterceptor, this.fetcher);

            // wrap the fetcher with an interceptor that throw HTTPError exceptions for any HTTP response
            // with a status code >= 400
            this.fetcher = withIntercept(httpStatusInterceptor, this.fetcher);
        }
    }

    private baseUrl(): string {
        switch (typeof this.options.baseUrl) {
            case 'string':
                return this.options.baseUrl;
            case 'function':
                return this.options.baseUrl();
            default:
                return '';
        }
    }

    async fetch(url: string, init?: FetchRequestInit): Promise<FetchResponse> {
        let dofetch = async (url: string, init?: FetchRequestInit) => {
            const _init: FetchRequestInit = {
                ...this.options.fetchOptions, // default fetch option
                ...init // per-request headers always take precedence
            };

            if (this.options.headers) {
                _init.headers = {
                    ...(await this.options.headers()), // default headers first
                    ..._init.headers // per-request headers always take precedence
                };
            }

            return await this.fetcher(this.baseUrl() + url, _init);
        };

        if (this.options.retry !== false) {
            const retryOpts = { ...defaultRetryOptions, ...this.options.retry };
            dofetch = withRetry(retryOpts, dofetch);
        }

        return await dofetch(url, init);
    }
}
