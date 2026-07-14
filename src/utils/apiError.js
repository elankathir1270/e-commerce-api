class ApiError extends Error {
    constructor(statusCode,message){
        super(message),
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "Error" : "Fail";

        this.isOperational = true
        Error.captureStackTrace(this, this.constructor);
        //args: 'this' points to instance of AppError class, 'this.constructor' points to actual AppError class.

    }
}

module.exports = ApiError;