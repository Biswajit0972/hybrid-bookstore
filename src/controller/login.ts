import {Request, Response} from "express";

import {asyncHandler} from "../utils/AsyncHandler";
import {ApiError} from "../utils/AppError";
import {SuperAdminModel} from "../database/models/superAdmin.model";
import {SuperAdminSessionModel} from "../database/models/superAdminSession.model";
import {ApiResponse} from "../utils/AppResponse";


export const superAdminLogin = asyncHandler(async (req: Request, res: Response) => {

    if (!req.body) {
        throw new ApiError("Invalid request body", 400);
    }

    const {adminId, adminPassword, email} = req.body;

    if ((!adminId && !email) || !adminPassword ) {
        throw new ApiError("Invalid request body", 400);
    }

    const findAdmin = await SuperAdminModel.findOne({
        $or: [
            {adminId},
            {email}
        ]
    });

    if (!findAdmin) {
        throw new ApiError("Invalid credentials", 401);
    }

    const isMatchCredentials = await findAdmin.comparePassword(adminPassword);

    if (!isMatchCredentials) {
        throw new ApiError("Invalid credentials", 401);
    }

    const createSession = await SuperAdminSessionModel.create({
        adminId: findAdmin._id
    });

    if (!createSession) {
        throw new ApiError("Failed to create session", 500);
    }

    return res.status(200).cookie("sessionId", createSession._id, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000
    }).json(new ApiResponse(200, "Login successful", {
        sessionId: createSession._id
    }))
})