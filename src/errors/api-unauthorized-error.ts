import { CustomError } from './custom-error';

export class ApiUnauthorizedError extends CustomError {
    status = 401;

    constructor() {
        super('Unauthorized');
        Object.setPrototypeOf(this, ApiUnauthorizedError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Unauthorized'
            }
        ];
    }
}
