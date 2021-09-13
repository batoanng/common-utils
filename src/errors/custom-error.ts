export abstract class CustomerError extends Error {
    public abstract errorCode: number;

    protected constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomerError.prototype);
    }

    public abstract serializeError(): {
        message: string;
        field?: string;
    }[];
}
