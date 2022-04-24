import { CustomError } from './custom-error';

export class ApiForbiddenError extends CustomError {
    status = 403;

    constructor() {
        super('Forbidden');
        Object.setPrototypeOf(this, ApiForbiddenError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Forbidden'
            }
        ];
    }
}
