import multer from "multer";
import os from "os";
import path from "path";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (_req, file, cb) => {
    const safeExtension = path.extname(file.originalname || "").toLowerCase() || ".png";
    cb(null, `resume-upload-${Date.now()}${safeExtension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed."));
      return;
    }

    cb(null, true);
  },
});

export default upload;
