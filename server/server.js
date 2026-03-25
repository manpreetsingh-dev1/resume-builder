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

// database connection
await connectDB();


// Middleware
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Server is live...");
})
app.use ('/api/users',userRouter)
app.use('/api/resumes',resumeRouter)
app.use('/api/ai',aiRouter)
app.use('/api/feedback', feedbackRouter)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
