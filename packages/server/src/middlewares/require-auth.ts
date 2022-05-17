import { Request, Response, NextFunction } from 'express';
import { ApiUnauthorizedError } from '@joker7t/common-core';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        throw new ApiUnauthorizedError();
    }
    next();
};
