import { CustomError } from './custom-error';

export class ApiTooManyRequestsError extends CustomError {
    status = 429;

    constructor() {
        super('Too many requests');
        Object.setPrototypeOf(this, ApiTooManyRequestsError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Too many requests'
            }
        ];
    }
}
