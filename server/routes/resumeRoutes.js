import express from "express";
import multer from "multer";
import upload from "../configs/Multer.js";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
} from "../controllers/resumeController.js";
import protect from "../middlewares/authMiddleware.js";

const resumeRouter = express.Router();
const uploadSingleImage = upload.single("image");

const handleUpdateUpload = (req, res, next) => {
  uploadSingleImage(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image upload must be 10MB or smaller."
          : "Invalid image upload request.";

      res.status(400).json({ message });
      return;
    }

    res.status(400).json({
      message: error.message || "Only JPG, PNG, WEBP, and GIF images are allowed.",
    });
  });
};

resumeRouter.post("/create", protect, createResume);
resumeRouter.put("/update", protect, handleUpdateUpload, updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);
resumeRouter.get("/public/:resumeId", getPublicResumeById);
resumeRouter.get("/:resumeId", protect, getResumeById);

export default resumeRouter;
