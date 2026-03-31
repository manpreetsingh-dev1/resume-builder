import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import mongoose from "mongoose";

/**
 * Normalize resume data for API responses
 * Converts Mongoose documents to plain objects and ensures data consistency
 */
const normalizeResume = (resume) => {
  if (!resume) {
    return resume;
  }

  const normalizedResume =
    typeof resume.toObject === "function" ? resume.toObject() : { ...resume };

  normalizedResume.professional_summary =
    typeof normalizedResume.professional_summary === "string"
      ? normalizedResume.professional_summary
      : "";

  return normalizedResume;
};

// controller for creating a new resume
// POST :/api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        // create new resume
        const newResume = await Resume.create({ userId, title });

        // return success message
        return res
            .status(201)
            .json({ message: "Resume created successfully", resume: normalizeResume(newResume) });
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
// POST :/api/resumes/create
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
// GET: /api/resumes/public
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

/**
 * Update an existing resume with new data and/or image upload
 * PUT: /api/resumes/update
 * 
 * Request Body (FormData):
 *   - resumeId: string (MongoDB ObjectId)
 *   - resumeData: JSON string containing resume fields
 *   - image: optional File object for profile picture
 *   - removeBackground: optional "yes" string flag
 */
export const updateResume = async (req, res) => {
  let tempFilePath = null;

  try {
    const userId = req.userId; // from auth middleware
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    // ✅ Validate resumeId format
    if (!resumeId || typeof resumeId !== "string") {
      return res.status(400).json({ message: "Resume ID is required and must be a string" });
    }

    const trimmedResumeId = resumeId.trim();

    if (!mongoose.Types.ObjectId.isValid(trimmedResumeId)) {
      return res.status(400).json({ message: "Invalid Resume ID format" });
    }

    // ✅ Validate resumeData exists
    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    // ✅ Parse resume data
    let resumeDataCopy;
    try {
      resumeDataCopy =
        typeof resumeData === "string" ? JSON.parse(resumeData) : structuredClone(resumeData);
    } catch (parseError) {
      console.error("Failed to parse resumeData:", parseError);
      return res.status(400).json({ message: "Invalid resume data format" });
    }

    // ✅ Handle image upload to ImageKit
    if (image) {
      tempFilePath = image.path;

      try {
        const imageStream = fs.createReadStream(tempFilePath);

        const uploadResponse = await imagekit.files.upload({
          file: imageStream,
          fileName: `resume_${trimmedResumeId}_${Date.now()}.png`,
          folder: "user-resumes",
          tags: ["resume", "profile"],
        });

        // Save ImageKit URL to resume data
        if (!resumeDataCopy.personal_info) {
          resumeDataCopy.personal_info = {};
        }
        resumeDataCopy.personal_info.image = uploadResponse.url;

        console.log("Image uploaded successfully:", uploadResponse.url);
      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image to ImageKit" });
      }
    }

    // ✅ Update resume in database
    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: trimmedResumeId },
      { $set: resumeDataCopy },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found or you don't have permission to edit it" });
    }

    return res.status(200).json({
      message: "Resume saved successfully",
      resume: normalizeResume(updatedResume),
    });
  } catch (error) {
    console.error("updateResume error:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid resume data provided" });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Resume ID format" });
    }

    return res.status(500).json({ message: "Failed to save resume. Please try again." });
  } finally {
    // ✅ Cleanup temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          console.error("Failed to delete temporary file:", tempFilePath, err);
        } else {
          console.log("Temporary file cleaned up:", tempFilePath);
        }
      });
    }
  }
};