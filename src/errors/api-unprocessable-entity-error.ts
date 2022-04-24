import { CustomError } from './custom-error';

export class ApiUnprocessableEntityError extends CustomError {
    status = 422;

    constructor() {
        super('Unprocessable entity');
        Object.setPrototypeOf(this, ApiUnprocessableEntityError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Unprocessable entity'
            }
        ];
    }
}
