import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export async function localUpload({ file, folder }) {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const baseUrl = process.env.UPLOAD_PUBLIC_BASE_URL || "http://localhost:3000";

  const safeFolder = folder?.replace(/[^a-z0-9/_-]/gi, "") || "misc";
  const outDir = path.join(process.cwd(), uploadDir, safeFolder);

  ensureDir(outDir);

  const ext = path.extname(file.originalname || "") || ".bin";
  const fileName = `${uuid()}${ext}`;
  const absPath = path.join(outDir, fileName);

  fs.writeFileSync(absPath, file.buffer);

  const key = `${safeFolder}/${fileName}`;
  const url = `${baseUrl}/${uploadDir}/${key}`.replace(/\/+/g, "/").replace(":/", "://");

  return { key, url };
}

export async function localDelete({ key }) {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const absPath = path.join(process.cwd(), uploadDir, key);

  if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
}
