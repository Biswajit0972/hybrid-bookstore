import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/AppError";
import { UserModel } from "../../database/models/user.model";
import { ApiResponse } from "../../utils/AppResponse";

export const changeUserRole = asyncHandler(async (req: Request, res: Response) => {

    const authUserId = req.headers.AuthUserId as string;

    if (!authUserId) {
        throw new ApiError("Unauthorized Access", 401);
    }

    if (!req.body || !req.body.role) {
        throw new ApiError("Invalid request: role is required", 400);
    }

    const { role } = req.body;

    if (!["owner", "customer"].includes(role)) {
        throw new ApiError("Invalid role value", 400);
    }

    const user = await UserModel.findById(authUserId);

    if (!user) {
        throw new ApiError("User does not exist", 404);
    }

    if (user.role === role) {
        throw new ApiError("User already has the specified role", 400);
    }

    user.role = role;
    await user.save();

    return res.status(200).json(new ApiResponse(200, "Role updated successfully", user));
});
