import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL?.trim(),
  "http://localhost:5173",
].filter(Boolean);

// database connection
await connectDB();


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // optional, if you use cookies or auth
  })
);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is live...");
});
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
console.log("Resume routes loaded");
app.use("/api/ai", aiRouter);
app.use("/api/feedback", feedbackRouter);

app.use((error, req, res, next) => {
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blocked this request." });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
