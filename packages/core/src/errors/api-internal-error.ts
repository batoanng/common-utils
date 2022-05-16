import { CustomError } from './custom-error';

export class ApiInternalError extends CustomError {
    status = 500;

    constructor() {
        super('Internal Error');
        Object.setPrototypeOf(this, ApiInternalError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Internal Error'
            }
        ];
    }
}
