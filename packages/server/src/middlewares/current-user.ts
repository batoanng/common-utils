import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).session?.jwt) {
        return next();
    }
    try {
        req.currentUser = jwt.verify((req as any).session.jwt, process.env.JWT_SECRET!) as UserPayload;
    } catch (e) {
        console.error(e);
    }
    next();
};
