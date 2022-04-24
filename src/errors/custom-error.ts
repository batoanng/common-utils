export abstract class CustomError extends Error {
    public abstract status: number;

    protected constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    public abstract serializeError(): {
        message: string;
        field?: string;
    }[];
}
