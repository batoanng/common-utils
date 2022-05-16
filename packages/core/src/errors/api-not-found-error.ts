import { CustomError } from './custom-error';

export class ApiNotFoundError extends CustomError {
    status = 404;

    constructor() {
        super('Not found');
        Object.setPrototypeOf(this, ApiNotFoundError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Not found'
            }
        ];
    }
}
