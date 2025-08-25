import {Request, Response} from "express";
import {asyncHandler} from "../../utils/AsyncHandler";
import {ApiError} from "../../utils/AppError";
import {ApiResponse} from "../../utils/AppResponse";
import {UserModel} from "../../database/models/user.model";

export const userProfile = asyncHandler(async (req: Request, res: Response
) => {
    const authUserId = req.headers.AuthUserId as string;

    if (!authUserId) {
        throw new ApiError("Unauthorized Access", 401);
    }

    const fetchUserProfile = await UserModel.findById(authUserId).select(["-password", "-v"]);

    if (!fetchUserProfile) throw new ApiError("user  profile not found", 404);

    return res.status(200).json(new ApiResponse(200, "user profile fetched successfully", fetchUserProfile))
})