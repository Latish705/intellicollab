import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL!);
    console.log(conn.connection.host);
    return;
  } catch (error: any) {
    console.log("Error connecting db");
    process.exit(1);
  }
};

export default connectDB;
