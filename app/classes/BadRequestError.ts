import ExpressError from "./ExpressError";

class BadRequestError extends ExpressError {
    public status = 400;

    constructor(message: string, humanReadableError: string) {
        super(message, humanReadableError)
    }
}

export default BadRequestError;