import { CustomError } from './custom-error';

export class ApiServiceUnavailableError extends CustomError {
    status = 503;

    constructor() {
        super('Service unavailable');
        Object.setPrototypeOf(this, ApiServiceUnavailableError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Service unavailable'
            }
        ];
    }
}
