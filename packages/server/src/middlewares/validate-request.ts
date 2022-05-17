import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiRequestValidationError } from '../errors/api-request-validation-error';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiRequestValidationError(errors.array());
    }
    next();
};
