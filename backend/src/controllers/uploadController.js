const db = require("../../models");
const { uploadFile } = require("../../services/storage/storageService");

async function uploadProductImage(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const result = await uploadFile({ file, folder: "products" });

  await db.Log.create({
    userId: req.user.id,
    action: "PRODUCT_IMAGE_UPLOADED",
    details: `Uploaded product image (${file.originalname})`,
  });

  return res.json({ data: result });
}

module.exports = {
  uploadProductImage,
};
