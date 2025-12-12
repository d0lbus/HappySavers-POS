const { Router } = require("express");
const { authenticateJWT, authorizeRoles } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");
const { uploadProductImage } = require("../controllers/uploadController");

const router = Router();

router.post(
  "/products",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  upload.single("image"),
  uploadProductImage
);

module.exports = router;
