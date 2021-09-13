import { CustomerError } from './custom-error';

export class NotFoundError extends CustomerError {
    errorCode = 404;

    constructor() {
        super('Invalid route');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'not found',
            },
        ];
    }
}
