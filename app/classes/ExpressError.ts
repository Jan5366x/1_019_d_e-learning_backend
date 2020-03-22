class ExpressError extends Error {
    public status?: number;
    public humanReadableError?: string;
    public needAuth?: boolean;

    constructor(message?: string, humanReadableError?: string, statusCode?: number, needAuth?: boolean) {
        super(message)
        this.status = statusCode;
        this.humanReadableError = humanReadableError;
        this.needAuth = needAuth;
    }
}

export default ExpressError;
