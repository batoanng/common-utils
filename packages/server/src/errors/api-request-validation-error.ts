import { ValidationError } from 'express-validator';
import { CustomError } from '@joker7t/common-utils-core';

/**
 * This is an enhanced version of BadRequestError, built in with express validator
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
