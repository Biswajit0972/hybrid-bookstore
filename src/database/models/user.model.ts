import mongoose, {Schema, Model} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Iuser} from "../../utils/types";

const UserSchema = new Schema<Iuser>(
    {
        fullName: {type: String, required: true},
        phone: {type: String, required: true, unique: true},
        alternatNumber: {type: String},
        address: {type: String, required: true},
        blockStatus: {
            type: String,
            enum: ["blocked", "unblocked", "warning",  "banned"],
            default: null,
        },
        role: {
            type: String,
            enum: ["owner", "customer"],
            default: "customer",
        },
        password: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
    },
    {timestamps: true}
);

UserSchema.index({phone: 1, email: 1, username: 1}, {unique: true});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
      process.env.ACCESS_TOKEN_SECRET || "",
        { expiresIn: "15m" } // 15 minutes
    );
};


UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET || "",
        { expiresIn: "7d" } // 7 days
    );
};

export const UserModel: Model<Iuser> = mongoose.model<Iuser>("User", UserSchema);
