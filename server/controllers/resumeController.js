import fs from "fs";
import { promises as fsPromises } from "fs";
import mongoose from "mongoose";
import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import normalizeResume from "../utils/normalizeResume.js";

const parseResumePayload = (resumeData) => {
  if (!resumeData) {
    throw new Error("Resume data is required.");
  }

  if (typeof resumeData === "string") {
    return JSON.parse(resumeData);
  }

  if (typeof resumeData === "object") {
    return structuredClone(resumeData);
  }

  throw new Error("Resume data must be a JSON object or JSON string.");
};

const uploadResumeImage = async ({ image, resumeId, removeBackground }) => {
  if (!image) {
    return "";
  }

  if (!imagekit) {
    throw new Error("Image upload is not configured on the server.");
  }

  const transformation = [
    "w-300",
    "h-300",
    "c-maintain_ratio",
    "fo-face",
    "z-0.75",
    removeBackground ? "e-bgremove" : null,
  ]
    .filter(Boolean)
    .join(",");

  const uploadResponse = await imagekit.files.upload({
    file: fs.createReadStream(image.path),
    fileName: `resume_${resumeId}_${Date.now()}${image.originalname ? `_${image.originalname}` : ".png"}`,
    folder: "user-resumes",
    useUniqueFileName: true,
    transformation: {
      pre: transformation,
    },
  });

  return uploadResponse?.url || "";
};

// controller for creating a new resume
// POST :/api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: normalizeResume(newResume),
    });
  } catch (error) {
    console.error("createResume error:", error);
    return res.status(500).json({ message: "Failed to create resume." });
  }
};

// controller for delete resume
// DELETE :/api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deletedResume = await Resume.findOneAndDelete({ userId, _id: resumeId });

    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(201).json({ message: "Resume delete successfully" });
  } catch (error) {
    console.error("deleteResume error:", error);
    return res.status(500).json({ message: "Failed to delete resume." });
  }
};

// controller for get user resume by id
// GET :/api/resumes/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume: normalizeResume(resume) });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id public
// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume: normalizeResume(resume) });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for updating a resume
// PUT :/api/resumes/update
export const updateResume = async (req, res) => {
  const tempFilePath = req.file?.path || "";

  try {
    const userId = req.userId;
    const rawResumeId =
      typeof req.body?.resumeId === "string" ? req.body.resumeId.trim() : "";

    if (!rawResumeId) {
      return res.status(400).json({ message: "resumeId is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(rawResumeId)) {
      return res.status(400).json({ message: "Invalid resumeId." });
    }

    let parsedResumeData;

    try {
      parsedResumeData = parseResumePayload(req.body?.resumeData);
    } catch (parseError) {
      return res.status(400).json({ message: parseError.message });
    }

    const removeBackground =
      req.body?.removeBackground === "yes" ||
      req.body?.removeBackground === "true" ||
      req.body?.removeBackground === true;

    const existingResume = await Resume.findOne({
      _id: rawResumeId,
      userId,
    });

    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    const nextResumeData =
      parsedResumeData && typeof parsedResumeData === "object"
        ? parsedResumeData
        : {};

    delete nextResumeData._id;
    delete nextResumeData.userId;
    delete nextResumeData.createdAt;
    delete nextResumeData.updatedAt;

    nextResumeData.personal_info =
      nextResumeData.personal_info &&
      typeof nextResumeData.personal_info === "object"
        ? nextResumeData.personal_info
        : {};

    if (req.file) {
      const uploadedImageUrl = await uploadResumeImage({
        image: req.file,
        resumeId: rawResumeId,
        removeBackground,
      });

      if (!uploadedImageUrl) {
        return res.status(500).json({ message: "Image upload failed." });
      }

      nextResumeData.personal_info.image = uploadedImageUrl;
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: rawResumeId, userId },
      { $set: nextResumeData },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    return res.status(200).json({
      message: "Resume saved successfully.",
      resume: normalizeResume(updatedResume),
    });
  } catch (error) {
    console.error("updateResume error:", error);

    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid resume data provided." });
    }

    if (error?.name === "SyntaxError") {
      return res.status(400).json({ message: "resumeData must be valid JSON." });
    }

    if (error?.message === "Image upload is not configured on the server.") {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to update resume." });
  } finally {
    if (tempFilePath) {
      try {
        await fsPromises.unlink(tempFilePath);
      } catch (cleanupError) {
        if (cleanupError?.code !== "ENOENT") {
          console.error("Failed to clean up uploaded file:", cleanupError);
        }
      }
    }
  }
};
