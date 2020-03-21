class ExpressError extends Error {
    public status?: number;
    public humanReadableError?: string;
    constructor(message?: string, humanReadableError?: string, statusCode?: number) {
        super(message)
        this.status = statusCode;
        this.humanReadableError = humanReadableError;
    }
}

export default ExpressError;