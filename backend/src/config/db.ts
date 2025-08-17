import mongoose from "mongoose";
import { MONGO_URI } from "../utils/getEnv";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ connected to database");
  } catch (error) {
    console.log("❌ coudn't connect to database");
    process.exit(1);
  }
};

export default connectDB;
