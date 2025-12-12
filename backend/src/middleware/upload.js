import multer from "multer";

const maxMb = Number(process.env.UPLOAD_MAX_MB || 5);
const allowed = (process.env.UPLOAD_ALLOWED_MIME || "image/jpeg,image/png,image/webp")
  .split(",")
  .map((s) => s.trim());

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowed.includes(file.mimetype)) return cb(new Error("Invalid file type"), false);
    cb(null, true);
  },
});
