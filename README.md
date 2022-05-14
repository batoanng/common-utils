# common-utils

### This is a simple code share, contains some useful functions which you can use to make your work easier ✌️✌️.

NPM page: https://www.npmjs.com/package/@joker7t/common-utils

**Installation:**

Using Yarn
> yarn add @joker7t/common-utils

Using NPM
>npm i @joker7t/common-utils

## **Versions:**

### `1.0.3`
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
    - **Lock**
      - acquire waits for the lock and then executes the provided callback ensuring the lock is released after the callback completes.
      - example:
      ````
      const lock = new Lock();
    
      //..
    
      await lock.acquire(() => {
        // critical section
      });
      ````


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

