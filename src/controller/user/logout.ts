import {Request, Response} from "express";
import {asyncHandler} from "../../utils/AsyncHandler";
import {ApiError} from "../../utils/AppError";
import {ApiResponse} from "../../utils/AppResponse";

export const userLogout = asyncHandler(async (req: Request, res: Response) => {

    const authUserId = req.headers.AuthUserId as string;

    if (!authUserId) {
        throw new ApiError("Unauthorized Access", 401);
    }

    return res.status(200).clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    }).clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
    }).json(new ApiResponse(200, "Logout successful"));
});