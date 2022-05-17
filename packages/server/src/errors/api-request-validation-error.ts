import { ValidationError } from 'express-validator';
import { CustomError } from '@joker7t/common-core';

/**
 * This is an enhanced version of [ApiBadRequestError](https://github.com/joker7t/common-utils/blob/master/packages/core/src/errors/api-bad-request-error.ts), built in with express validator
 * Allow you to pass your invalid params and its validate message.
 */
export class ApiRequestValidationError extends CustomError {
    status = 400;

    constructor(private errors: ValidationError[]) {
        super('Invalid parameters');
        Object.setPrototypeOf(this, ApiRequestValidationError.prototype);
    }

    serializeError() {
        return this.errors.map((err) => {
            return {
                message: err.msg,
                field: err.param
            };
        });
    }
}
