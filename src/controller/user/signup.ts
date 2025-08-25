import {Request, Response} from "express";
import {asyncHandler} from "../../utils/AsyncHandler";
import {ApiError} from "../../utils/AppError";
import {UserModel} from "../../database/models/user.model";
import {ApiResponse} from "../../utils/AppResponse";

export const userRegistration = asyncHandler(async (req: Request, res: Response) => {

    if (!req.body) {
        throw new ApiError("Invalid request body", 400);
    }

    const {fullName, phone, alternatNumber, address, blockStatus, role, password, email, username} = req.body;


    if (!fullName || !phone || !address || !password || !email || !username) {
        throw new ApiError("All mandatory fields are required.", 400);
    }


    const existingUser = await UserModel.findOne({
        $or: [
            {email},
            {phone},
            {username}
        ]
    });

    if (existingUser) {
        throw new ApiError("User with this email, phone, or username already exists.", 409);
    }

    const newUser = await UserModel.create({
        fullName,
        phone,
        alternatNumber,
        address,
        blockStatus, // will default to "null" if not given
        role,        // will default to "customer" if not given
        password,
        email,
        username
    });

    if (!newUser) {
        throw new ApiError("Failed to create user, please try again", 500);
    }

    const userData = await UserModel.findById(newUser._id).select(["-password", "-v"]);

    return res.status(201).json(new ApiResponse(201, "User created successfully", userData));
});
