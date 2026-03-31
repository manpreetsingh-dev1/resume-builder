import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
} from "../controllers/resumeController.js";
import upload from "../configs/Multer.js";

const resumeRouter = express.Router();

/**
 * Resume Routes Configuration
 * All private routes require authentication via protect middleware
 * Image uploads handled by multer middleware
 */

// ✅ CREATE - Create a new resume
resumeRouter.post("/create", protect, createResume);

// ✅ UPDATE - Update resume with optional image upload
// This route accepts FormData with resumeId, resumeData, and optional image file
resumeRouter.put("/update", protect, upload.single("image"), updateResume);

// ✅ DELETE - Delete a resume by ID
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);

// ✅ GET - Get a specific resume (private - user's own resume)
resumeRouter.get("/get/:resumeId", protect, getResumeById);

// ✅ GET - Get resume by ID (shorthand, also private)
resumeRouter.get("/:resumeId", protect, getResumeById);

// ✅ GET - Get public resume (no auth required)
resumeRouter.get("/public/:resumeId", getPublicResumeById);

export default resumeRouter;



