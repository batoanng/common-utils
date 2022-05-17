# common-utils

### This is a simple code share, contains some useful functions which you can use to make your work easier ✌️✌️.
This repo contains 3 packages:
1. [common-core](https://github.com/joker7t/common-utils/tree/master/packages/core): contains common utils, templates.
1. [common-react](https://github.com/joker7t/common-utils/tree/master/packages/react): specific utils for react.
1. [common-server](https://github.com/joker7t/common-utils/tree/master/packages/server): specific utils for server.

## **Versions:**

### common-core
#### `1.0.0`

### common-react
#### `1.0.0`

### common-server
#### `1.0.0`

---
### `2.0.0`

### `1.0.4`
- React:
    - **useQuery**
      - The useQuery hook id the best used for loading some data from an API that need to be used right away in the react component.
      - For example, loading a list of items that need to be displayed.
      - The hook is reactive and will automatically reload data from the API if the request parameters change.
    ```typescript
    const { data, loading, error, refetch } = useQuery(client.example.getExample, {
        paramters: {
            // ...
        }
    }) 
    ```
    - **useQueryLazy**
      - The useQueryLazy is a lazy version of useQuery; meaning it will only fetch data from the API when you call the `load()` method.
      - The useQueryLazy hook is the best used when some data needs to be loaded and displayed after some user actions, for example the user clicks a "show details" button.
    ```typescript
        const [load, { data, loading, error, called, reset }] = useQueryLazy(client.example.getExample, {
        // The request object can be passed to the hook itseft 
        // or as an argument when calling `load(request)`    
        paramters: {
                // ...
            }
        }) 
    ```
    - **useMutation**
      - the useMutation hook is designed for calling API that mutate data i.e. POST/PUT/PATCH/DELETE.
      - the hook provides a `mutate()` function that accepts the API request object returning an API response.
      - this hook can be used to implement form submission handlers to POST data to the API.
    ```typescript
        const [mutate, { data, loading, error, called, reset }] = useMutation(client.example.getExample); 
    ```

- Errors:
  - refactor all errors to match with api error format: change field `errorCode` to `status`.
  - Add more defined errors, also change name of the old one to match with general convention. The list of error:
    - CustomError
    - ApiBadRequestError
    - ApiRequestValidationError
    - ApiUnauthorizedError
    - ApiForbiddenError
    - ApiNotFoundError
    - ApiRequestTimeoutError
    - ApiConflictError
    - ApiUnprocessableEntityError
    - ApiInternalError
    - ApiServiceUnavailableError
    - ApiGatewayTimeoutError
    - ApiNetworkError

- Async utils
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


### `1.0.2`
- Utils
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

- Async utils
  - **sleep(seconds: number)**
    - returns a promise that resolves after for the given number of seconds using setTimeout.

### `1.0.1`
- Template for common api error
  - BadRequestError
  - DatabaseConnectionError
  - NotAuthorizedError
  - NotFoundError
  - RequestValidationError
  - CustomerError

