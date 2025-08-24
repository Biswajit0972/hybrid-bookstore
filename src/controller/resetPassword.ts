import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/AppError";
import { SuperAdminModel } from "../database/models/superAdmin.model";
import { ApiResponse } from "../utils/AppResponse";
import { SuperAdminRequestBody } from "../utils/types";
import {SuperAdminSessionModel} from "../database/models/superAdminSession.model";

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {

    const { adminId, newPassword } = req.body as SuperAdminRequestBody;

    if (!adminId || !newPassword) {
        throw new ApiError("Admin ID and new password are required", 400);
    }

    const getAdmin = await SuperAdminModel.findOne({ adminId });

    if (!getAdmin) {
        throw new ApiError("Admin not found", 404);
    }


    const isSamePassword = await getAdmin.comparePassword(newPassword);

    if (isSamePassword) {
        throw new ApiError("New password cannot be the same as the old password", 400);
    }

    getAdmin.adminPassword = newPassword;
    await getAdmin.save();
    await SuperAdminSessionModel.findById(req.headers.sessionId);

    return res
        .status(200)
        .json(new ApiResponse(200, "Password reset successfully, please login again!"));
});
