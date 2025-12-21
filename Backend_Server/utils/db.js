import mongoose from "mongoose";

const dbCon = async () => {
    try {
        const mongoURI = process.env.DB_URL;
        await mongoose.connect(mongoURI);
        console.log("mongodb is connected");
    } catch (error) {
        console.log("Database connection error:", error);
    }
}

export default dbCon;