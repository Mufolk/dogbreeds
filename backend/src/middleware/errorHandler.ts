import { Request, Response, NextFunction } from 'express'
import config from '../config/config';
import { Logger } from '../utils/logger';


export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    let { statusCode = 500, message } = error;

    Logger.error('Unhandled error', {
        error: message,
        stack: error.stack,
        url: req.url,
        method: req.method,
    });

    if (config.nodeEnv === 'production' && statusCode === 500) {
        message = 'Internal server error';
    };

    res.status(statusCode).json({
        error: {
            message,
            ...(config.nodeEnv === 'development' && { stack: error.stack })
        },
        timeStamp: new Date().toISOString(),
        path: req.originalUrl,
    });
};


export const createError = (message: string, statusCode: number = 500): AppError => {
    const error : AppError = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
