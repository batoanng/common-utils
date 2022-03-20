import { CustomerError } from './custom-error';

export class DatabaseConnectionError extends CustomerError {
    errorCode = 500;

    private reason = 'Error while connect to the database';

    constructor() {
        super('Error while connect to the db');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeError() {
        return [
            {
                message: this.reason
            }
        ];
    }
}
