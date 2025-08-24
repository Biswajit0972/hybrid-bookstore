import mongoose from "mongoose";

export const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
        console.log("Database is connection established")

    } catch (error) {
        console.log(error)
    }
}