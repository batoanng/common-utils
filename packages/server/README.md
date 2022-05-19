# common-server

NPM page: https://www.npmjs.com/package/@joker7t/common-server

## Installation:

Using Yarn
> yarn add @joker7t/common-server

Using NPM
>npm i @joker7t/common-server

## Features:
### Middlewares
- **validateRequest**
  - Use `express-validator` to validate user's requests.
  - Then format and return array of errors with detail message by `ApiRequestValidationError`.
- **errorHandler**
  - Handle errors for an API: if error is an instance of `CustomError`, do `serializeError` and return with defined status. If not, return with default message **'Something went wrong'** and status **400**.
- **currentUser**
  - Check if request's session has jwt. If have jwt, this middleware will verify it with `JWT_SECRET` env and set it to `req.currentUser`. 
  - The format of verified jwt:
  ```typescript
    {
        id: string;
        email?: string;
    }
  ```
- **requireAuth**
  - Use when API needs to authenticate, this use the result from `currentUser` middleware.
  - if have `currentUser` object in request then let user access the API, if not throw [ApiUnauthorizedError](https://github.com/joker7t/common-utils/blob/master/packages/core/src/errors/api-unauthorized-error.ts).

### Error templates
- ApiRequestValidationError
  - This is an enhanced version of [ApiBadRequestError](https://github.com/joker7t/common-utils/blob/master/packages/core/src/errors/api-bad-request-error.ts), built in with express validator.
  - Allow you to pass your invalid params and its validate message.

## **Versions:**
You can check all the versions [here](https://github.com/joker7t/common-utils#common-server).
