import { localUpload, localDelete } from "./localStorage.js";
// future: import { s3Upload, s3Delete } from "./s3Storage.js";

export async function uploadFile({ file, folder }) {
  const driver = process.env.STORAGE_DRIVER || "local";

  if (driver === "local") return localUpload({ file, folder });

  // if (driver === "s3") return s3Upload({ file, folder });

  throw new Error(`Unsupported STORAGE_DRIVER: ${driver}`);
}

export async function deleteFile({ key }) {
  if (!key) return;

  const driver = process.env.STORAGE_DRIVER || "local";

  if (driver === "local") return localDelete({ key });

  // if (driver === "s3") return s3Delete({ key });

  throw new Error(`Unsupported STORAGE_DRIVER: ${driver}`);
}
