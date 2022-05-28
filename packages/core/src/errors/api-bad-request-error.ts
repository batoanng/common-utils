import { CustomError } from './custom-error';

export class ApiBadRequestError extends CustomError {
    status = 400;

    msg: string;

    constructor(errorMsg?: string) {
        super(errorMsg || 'Bad request');
        this.msg = errorMsg || 'Bad request';
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
