import { CustomerError } from './custom-error';

export class NotAuthorizedError extends CustomerError {
    errorCode = 401;

    constructor() {
        super('Not Authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Not authorized'
            }
        ];
    }
}
