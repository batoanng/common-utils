import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@joker7t/common-core';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
        return res.status(error.status).json({ errors: error.serializeError() });
    }
    console.error(error);
    return res.status(400).json({
        errors: [
            {
                message: 'Something went wrong'
            }
        ]
    });
};
