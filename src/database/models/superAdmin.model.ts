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


superAdminSchema.pre('save', async function (next) {
    if (!this.isModified('adminPassword')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);

    this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
    next();
});

superAdminSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password,  this.adminPassword);
}

export const SuperAdminModel = model<SuperAdmin>('SuperAdmin', superAdminSchema);