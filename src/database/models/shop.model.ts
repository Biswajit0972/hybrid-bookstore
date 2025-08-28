import {Schema, model} from "mongoose";
import {IDelShop, IShop} from "../../utils/types";

const DeleteSchema = new Schema<IDelShop>({
    wantsToDelete: {
        type: Boolean,
        default: false,
    },
    requestStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: null
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin',
    }
}, {timestamps: true});

const ShopSchema = new Schema<IShop>({
    shopName: {type: String, required: true},
    location: {type: String, required: true},
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requestStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    blockStatus: {
        type: String,
        enum: ['blocked', 'unblocked', 'warning', 'null', 'banned'],
        default: 'null',
    },
    description: {type: String},
    address: {type: String, required: true},
    shopImage: {type: String},
    delShop: DeleteSchema,
}, {timestamps: true});

export const ShopModel = model<IShop>('shop', ShopSchema)