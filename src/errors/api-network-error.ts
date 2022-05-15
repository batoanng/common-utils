import { CustomError } from './custom-error';

/**
 * The network error is the special case that only exists on the client side
 * A network error indicates a fetch failure
 * i.e. the network was disconnected, dns resolution failures, etc.
 * https://fetch.spec.whatwg.org/#concept-network-error
 */
export class ApiNetworkError extends CustomError {
    status = 0;

    msg: string;

    constructor(errorMsg?: string) {
        const msg = errorMsg || 'Network error';
        super(msg);
        this.msg = msg;
        Object.setPrototypeOf(this, ApiNetworkError.prototype);
    }

    serializeError() {
        return [
            {
                message: this.msg
            }
        ];
    }
}
