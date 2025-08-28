import {Request, Response} from "express";
import {asyncHandler} from "../../utils/AsyncHandler";
import {ApiError} from "../../utils/AppError";
import {ApiResponse} from "../../utils/AppResponse";
import {ShopModel} from "../../database/models/shop.model";
import mongoose from "mongoose";

export const deleteShop =  asyncHandler(async (req: Request, res: Response) => {
    if (!req.headers.ownerId) {
        throw  new ApiError("Internal server Error", 500);
    }

    if (!req.body) {
        throw new ApiError("Invalid body, please add data  fields", 400);
    }

    const {shopId} = req.body;

    if (!shopId) {
        throw new ApiError("Please provide all the required fields", 400);
    }

    const findShop  = await ShopModel.findById(shopId);

    if (!findShop) {
        throw new   ApiError("Shop not found!", 404);
    }

    const isOwner = new mongoose.Types.ObjectId(req.headers.ownerId as string)

    if (!isOwner.equals(findShop.ownerId)) {
    throw new ApiError("you are not Authorized  to do this operation", 401);
    }

    if (findShop.requestStatus != 'active'){
        const directDelete = await ShopModel.findByIdAndDelete(findShop._id);
        if (!directDelete) {
            throw new ApiError("Internal server Error", 500);
        }
        return res.status(200).json(new ApiResponse(200, "Shop deleted successfully", directDelete));
    }

    findShop.delShop.wantsToDelete = true;
    await findShop.save();

   return res.status(200).json(new ApiResponse(200, "Shop delete request successfully send to the admin, please wait for apporval", findShop));
});