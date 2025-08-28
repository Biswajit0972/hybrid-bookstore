import {Request, Response} from "express";
import {asyncHandler} from "../../utils/AsyncHandler";
import {ApiError} from "../../utils/AppError";
import {ApiResponse} from "../../utils/AppResponse";
import {ShopModel} from "../../database/models/shop.model";


export const createShop = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body) throw new ApiError("Invalid body, please add data  fields", 400);

    const {shopName, location, address} = req.body;

    if (!shopName || !location || !address) {
        throw new ApiError("Please provide all the required fields", 400);
    }

    if ([shopName, location, address].some((item: string) => item.trim() === "")) {
        throw new ApiError("Please provide all the required fields", 400);
    }

    const ownerId = req.headers.ownerId as string;

    if (!ownerId) {
        throw new ApiError("Internal server error, we will fix it", 500);
    }

    const shop = await ShopModel.create({
        shopName, location, address, ownerId
    });

    if (!shop) {
        throw new ApiError("Internal server error, please try again", 500);
    }

    return res.status(201).json(new ApiResponse(201, "Shop created successfully", shop));
})