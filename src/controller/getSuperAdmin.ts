import { Request, Response } from "express";
import { ApiError } from "../utils/AppError";
import { SuperAdminModel } from "../database/models/superAdmin.model";
import { SuperAdminSessionModel } from "../database/models/superAdminSession.model";
import { ApiResponse } from "../utils/AppResponse";

export const getSuperAdminProfile = async (req: Request, res: Response) => {
    const sessionId = req.headers.sessionid || req.headers.sessionId;

    if (!sessionId) {
        throw new ApiError("unAuthorized access", 401);
    }


    const session = await SuperAdminSessionModel.findById(sessionId);
    
    if (!session) {
        throw new ApiError("Session not found", 401);
    }

    // session.adminId is the adminId (not MongoDB _id)
    const admin = await SuperAdminModel.findOne({ _id: session.adminId }).select(["-v", "-adminPassword", "-_id", "-role"]);

    if (!admin) {
        throw new ApiError("Admin not found", 404);
    }

    return res.status(200).json(new ApiResponse(200, "Session found", admin));
};
