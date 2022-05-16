import { CustomError } from './custom-error';

export class ApiConflictError extends CustomError {
    status = 409;

    constructor() {
        super('Conflict');
        Object.setPrototypeOf(this, ApiConflictError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Conflict'
            }
        ];
    }
}
