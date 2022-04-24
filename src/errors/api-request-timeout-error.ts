import { CustomError } from './custom-error';

export class ApiRequestTimeoutError extends CustomError {
    status = 408;

    constructor() {
        super('Request timeout');
        Object.setPrototypeOf(this, ApiRequestTimeoutError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Request timeout'
            }
        ];
    }
}
