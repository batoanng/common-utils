# common-core

NPM page: https://www.npmjs.com/package/@joker7t/common-core

## Installation:

Using Yarn
> yarn add @joker7t/common-core

Using NPM
>npm i @joker7t/common-core

## Features:
### Utils
- **memoize<T extends Function>(func: T): T**
  - An implementation of lodash's memoize function except it will memoize a function call based on all function arguments.
- **errorText(error: unknown): string**
  - Parsing error to message, return turn default message if exist otherwise return default error message ('Oops, an unexpected error occurred').
- **groupByKeySet<T>(items: T[], keySelector: (value: T) => string[])**
  - Grouping items by each key in keySelector
- **dateToIsoDate(dateString: string): string**
  - Transform a DD/MM/YYYY date string to ISO date string
- **isIsoDateValid(isoDateString: any): isoDateString is string**
  - Validate an ISO date string
- **formatNumber(num: number)**
  - Format number to K base.
- **formatFileSize(size: number)**
  - Format file size to ['B', 'KB', 'MB', 'GB', 'TB'] suffix.


### Async utils
- **HttpClient**
  - The client is build on top of fetch. This means you can provide a fetch implementation in the browser i.e. window.fetch, or node-fetch for NodeJS.
    - **fetch**: Works the same as the global fetch function in Javascript. This is the only mandatory ClientOption.
    - **baseUrl**: This configures the default baseUrl for our fetch requests.
    - **headers**: This configures the default request headers.
    - **fetchOptions**: These are options that are passed onto fetch calls. They are used to set the http agent in NodeJS.
    - **retry**: There are a few different strategies you may use to retry calls. By default, an exponential backoff with 4 attempts is used but you may choose this amount of yourself if you wish. You may also decide the backoff strategy. This may either ber `backoffFixed` where a retry is consistently made after a certain number of seconds, or `backoffExponential` where the backoff starts with an initial number of seconds and increases up to a maximum number of seconds. For example, to create a retry strategy 10 times with 1 attempt every 2 seconds increasing with and extra 3 seconds each time.
      - The following errors are retried by default:
        - ApiTooManyRequestsError
        - ApiGatewayTimeoutError
        - ApiServiceUnavailableError
        - ApiNetworkError
    - **rateLimit**: Configures client-side rate limiting. The default client-side rate limit is set to 1 request/second to match the default client gateway limit. if you are using the HttpClient with the service gateway you will want to configure a rate limit matching the service's configured gateway rate limit.
    - **disableErrorTransform**: This option cannot be used when the HttpClient is passed to a generated API client class, but is useful when using the HttpClient as a drop in replacement for window.fetch. The error transform refers to the conversion of http errors to the corresponding x-rest error object i.e. ApiNotFoundError. Given this conversion is non-standard fetch behavior we have provided the option to turn it off.
- **Lock**
  - acquire waits for the lock and then executes the provided callback ensuring the lock is released after the callback completes.
  - example:
    ```typescript
    const lock = new Lock();
      
    //..
      
    await lock.acquire(() => {
    // critical section
    });
    ```
- **sleep(seconds: number)**
  - returns a promise that resolves after for the given number of seconds using setTimeout.

### Error templates
- Template for common api errors:
  - CustomError
  - ApiBadRequestError
  - ApiUnauthorizedError
  - ApiForbiddenError
  - ApiNotFoundError
  - ApiRequestTimeoutError
  - ApiConflictError
  - ApiUnprocessableEntityError
  - ApiTooManyRequestsError
  - ApiInternalError
  - ApiServiceUnavailableError
  - ApiGatewayTimeoutError
  - ApiNetworkError

## **Versions:**
You can check all the versions [here](https://github.com/joker7t/common-utils#common-core).
