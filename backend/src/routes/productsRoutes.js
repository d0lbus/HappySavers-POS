const { Router } = require("express");
const { authenticateJWT, authorizeRoles } = require("../middleware/authMiddleware");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleProductStatus,
  archiveProduct,
  restoreProduct,
} = require("../controllers/productController");

const router = Router();

router.get(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  listProducts
);

router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  getProduct
);

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  createProduct
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  updateProduct
);

router.patch(
  "/:id/status",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  toggleProductStatus
);

router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  archiveProduct
);

router.patch(
  "/:id/restore",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  restoreProduct
);

module.exports = router;
