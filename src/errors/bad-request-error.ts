import { CustomerError } from './custom-error';

export class BadRequestError extends CustomerError {
    errorCode = 400;

    msg: string;

    constructor(errorMsg: string) {
        super(errorMsg);
        this.msg = errorMsg;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeError() {
        return [
            {
                message: this.msg
            }
        ];
    }
}
