import {NextFunction, Request, Response} from "express";

export const Authorization = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.role !== role) {
            res.status(403).json({flag: false, message: "user is not authorized"});
        }

        if (req.headers.role === "owner") {
            req.headers.ownerId = req.headers.AuthUserId;
        }

        next();
    }
}