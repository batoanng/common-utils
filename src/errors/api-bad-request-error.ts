import { CustomError } from './custom-error';

export class ApiBadRequestError extends CustomError {
    status = 400;

    msg: string;

    constructor(errorMsg?: string) {
        const msg = errorMsg || 'Bad request';
        super(msg);
        this.msg = msg;
        Object.setPrototypeOf(this, ApiBadRequestError.prototype);
    }

    serializeError() {
        return [
            {
                message: this.msg
            }
        ];
    }
}
