import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("database connected successfully");
    });

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable not set");
    }

    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default connectDB;