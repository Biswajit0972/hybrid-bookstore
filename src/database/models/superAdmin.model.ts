import {Schema, model} from "mongoose";
import {SuperAdmin} from "../../utils/types";
import bcrypt from "bcrypt";

const superAdminSchema = new Schema<SuperAdmin>({
    adminId: {type: String, required: true},
    email: {type: String, required: true},
    adminPassword: {type: String, required: true},
    fullName: {type: String, required: true},
    role: {
        type: String,
        default: 'superAdmin'
    }
}, {timestamps: true});


superAdminSchema.pre('save', async function () {
    if (!this.isModified('adminPassword')) {
        return;
    }

    this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
});

superAdminSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password,  this.adminPassword);
}

export const SuperAdminModel = model<SuperAdmin>('SuperAdmin', superAdminSchema);