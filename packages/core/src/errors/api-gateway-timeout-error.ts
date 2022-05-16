import { CustomError } from './custom-error';

export class ApiGatewayTimeoutError extends CustomError {
    status = 504;

    constructor() {
        super('Gateway timeout');
        Object.setPrototypeOf(this, ApiGatewayTimeoutError.prototype);
    }

    serializeError() {
        return [
            {
                message: 'Gateway timeout'
            }
        ];
    }
}
