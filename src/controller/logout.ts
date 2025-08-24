import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/AppError";
import { SuperAdminSessionModel } from "../database/models/superAdminSession.model";
import { ApiResponse } from "../utils/AppResponse";

export const superAdminLogout = asyncHandler(async (req: Request, res: Response) => {
    const sessionId: string | undefined |  string[] = req.headers.sessionId;

    if (!sessionId) {
        throw new  ApiError("unAuthorized access", 401)
    }
    const deletedSession = await SuperAdminSessionModel.findByIdAndDelete(sessionId);

    if (!deletedSession) {
        throw new ApiError("Session not found or already expired", 404);
    }

    // Clear cookie
    res.clearCookie("sessionId", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return res.status(200).json(new ApiResponse(200, "Logout successful"));
});
