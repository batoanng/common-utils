/**
 * AsyncFunction<T> is just a type alias for an `async` function
 * i.e. any `async (args) => Promise` function will match the AsyncFunction<T> type
 */
export type AsyncFunction<T> = (...args: any[]) => Promise<T>;

/**
 * Awaited<T> represents some value that has been awaited
 * accounting for the recursive behaviour of `await`
 *
 * i.e. `Awaited<Promise<string>>`            is `string`
 * i.e. `Awaited<Promise<Promise<T>>>` is also a `string`
 *
 * in typescript 4.5 this is a builtin type called `Awaited`
 */
export type Awaited<T> = T extends Promise<infer U> ? { 0: Awaited<U>; 1: U }[U extends Promise<any> ? 0 : 1] : T;

export type ExponentialBackoffOptions = {
    initialSeconds: number;
    maxSeconds: number;
};

/**
 * this file contains interfaces that need to match fetch runtime
 *
 * - browser (window.fetch)
 * - nodejs (node-fetch lib)
 * - mobile (react-native)
 *
 * the interfaces have been written by copying the browser's fetch
 * interfaces and then removing bits that are not compatible between runtime.
 */
export type FetchRequestInit = {
    /**
     * A BodyInit object or null to set request's body
     */
    body?: any;

    /**
     * A string indicating how the request will interact with the browser's cache to set request's cache
     */
    cache?: RequestCache;

    /**
     * A string indicating whether credentials will be sent with the request always, never, or only when send to
     * a same-origin URL. Sets the request credentials
     */
    credentials?: RequestCredentials;

    /**
     * A Header object, an object literal, or an array of two-item arrays to set the request's headers.
     */
    headers?: Record<string, string>;

    /**
     * A cryptography hash of the resource to be fetched by request. Set the request's integrity
     */
    integrity?: string;

    /**
     * A boolean to set request's keepalive
     */
    keepalive?: boolean;

    /**
     * A string to set the request's method
     */
    method?: string;

    /**
     * A string to indicate whether the request will use CORS, or will be restricted to the same-origin URL.
     * Set the request's mode
     */
    mode?: RequestMode;

    /**
     * A string to indicate whether request follows redirects, results in an error upon encountering a redirect
     * or return the redirect (in an opaque fashion). Set the request's redirect
     */
    redirect?: RequestRedirect;

    /**
     * A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer
     */
    referrer?: string;

    /**
     * A referrer policy to set the request's referrerPolicy
     */
    referrerPolicy?: ReferrerPolicy;

    /**
     * An AbortSignal to set the request's signal
     */
    signal?: AbortSignal | null;

    //node-fetch extension
    /**
     * agent must be a http.Agent or https.Agent. from the nodejs 'http' and 'https' package
     */
    agent?: any;
};

export type FetchResponse = {
    readonly headers: any;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;
    clone(): FetchResponse;
    json(): Promise<any>;
    text(): Promise<string>;
};

export type FetchFn = (url: string, init: FetchRequestInit) => Promise<FetchResponse>;

export type FetchRequestConfig = Omit<FetchRequestInit, 'body' | 'method'>;

export type RateLimiterState = {
    lastCallTime: Date;
};

export type RateLimitOptions = {
    rateLimiter: (state: RateLimiterState) => Promise<void>;
};

export type RetryOptions<T = any> = {
    /**
     * The number of attempts that can be made
     * The first call counts as an attempt.
     */
    attempts: number;

    /**
     * A callback that is used to delay retry attempts
     * The following retry backoff functions are available in the package:
     * - backoffFixed
     * - backoffExponential
     */
    backoff: () => () => Promise<void>;

    /**
     * A callback that can be used to decide if a call needs to be retried
     * The callback is passed either an error or the call's result
     * The callback will be retried if the callback returns true
     * until attempts is reached or `when` returns false.
     * @param error
     * @param result
     * @param callParameters
     */
    when: (error: unknown | undefined, result: T | undefined, callParameters: any[]) => boolean | Promise<boolean>;
};
