import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  mongoose.connection.on("connected", () => {
    console.log("database connected successfully");
  });

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable not set");
  }

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    const isLocalMongo =
      mongoUri.includes("localhost:27017") || mongoUri.includes("127.0.0.1:27017");

    if (isLocalMongo && error.name === "MongoNetworkError") {
      console.error(
        [
          "Error connecting to MongoDB:",
          error.message,
          "",
          "Your app is configured to use a local MongoDB server:",
          `MONGODB_URI=${mongoUri}`,
          "",
          "Fix one of these:",
          "1. Start MongoDB locally so it is listening on port 27017.",
          "2. Replace MONGODB_URI in server/.env with your MongoDB Atlas connection string.",
        ].join("\n")
      );
    } else {
      console.error("Error connecting to MongoDB:", error.message);
    }

    throw error;
  }
};

export default connectDB;
