const {ErrorCodes} = require('../utils/ErrorConstants');

const ErrorHandler = (err, req, res, next) => {

    const errorMessage = err.message || 'Internal Server Error';
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);

    switch (statusCode){
        case ErrorCodes.NOT_FOUND:
            res.status(statusCode).json({title: "Not Found", message: errorMessage, stack: err.stack});
            break;
        case ErrorCodes.INTERNAL_SERVER_ERROR:
            res.status(statusCode).json({title: "Internal Server Error", message: errorMessage, stack: err.stack});
            break;
        case ErrorCodes.UNAUTHORIZED:
            res.status(statusCode).json({title: "Unauthorized", message: errorMessage, stack: err.stack});
            break;
        case ErrorCodes.FORBIDDEN:
            res.status(statusCode).json({title: "Forbidden", message: errorMessage, stack: err.stack});
            break;
        case ErrorCodes.BAD_REQUEST:
            res.status(statusCode).json({title: "Bad Request", message: errorMessage, stack: err.stack});
            break;
        case ErrorCodes.CONFLICT:
            res.status(statusCode).json({title: "Conflict", message: errorMessage, stack: err.stack});
            break;
        case ErrorCodes.SERVICE_UNAVAILABLE:
            res.status(statusCode).json({title: "Service Unavailable", message: errorMessage, stack: err.stack});
            break;
        default:
            res.status(statusCode).json({title: "Internal Server Error", message: errorMessage, stack: err.stack});
            break;
    }


};
module.exports = ErrorHandler;