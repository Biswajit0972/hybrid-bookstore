import {Request, Response, NextFunction} from "express";
import {ApiError} from "../../utils/AppError";
import {SuperAdminSessionModel} from "../../database/models/superAdminSession.model";

export const isAdminLoggedIN = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sessionId: string | undefined = req.cookies?.sessionId || req.headers.authorization;

        if (!sessionId) {
            throw new ApiError("No active session found", 401);
        }

        const isSessionBasedOnAuthorization = sessionId.startsWith("Bearer ");

        if (isSessionBasedOnAuthorization) {
            sessionId = sessionId.split(" ")[1];
        }

        const session = await SuperAdminSessionModel.findById(sessionId);

        if (!session) {
            throw new ApiError("Session not found or already expired", 404);
        }

        req.headers.sessionId = sessionId;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            console.error(error.message);
            return res.status(error.statusCode).json({flag: false, message: error.message});

        }

        const err = error as Error;
        console.error(err.message);
        return res.status(500).json({flag: false, message: err.message});
    }
}