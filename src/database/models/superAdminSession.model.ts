import {Schema, model} from "mongoose";
import {SuperAdminSession} from "../../utils/types";

const superAdminSessionSchema = new Schema<SuperAdminSession>({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin',
        required: true,
    }
}, {timestamps: true});

export const SuperAdminSessionModel = model<SuperAdminSession>('SuperAdminSession', superAdminSessionSchema);