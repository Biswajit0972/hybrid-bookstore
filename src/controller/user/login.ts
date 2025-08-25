import {Request, Response} from "express";
import {asyncHandler} from "../../utils/AsyncHandler";
import {ApiError} from "../../utils/AppError";
import {UserModel} from "../../database/models/user.model";
import {ApiResponse} from "../../utils/AppResponse";

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body) {
        throw new ApiError("Invalid request body", 400);
    }

    const {identifier, password} = req.body;

    if (!identifier || !password) {
        throw new ApiError("All mandatory fields are required.", 400);
    }


    const user = await UserModel.findOne({
        $or: [
            {email: identifier},
            {username: identifier},
            {phone: identifier}
        ]
    }).select(["-password", "-v"]);

    if (!user) {
        throw new ApiError("Invalid credentials.", 401);
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
        throw new ApiError("Invalid credentials.", 401);
    }

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateRefreshToken();

    return res.status(200)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000
        })
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }).json(new ApiResponse(200, "Login successful", {
            accessToken,
            refreshToken,
            user
        }))
});
