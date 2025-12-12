const { Router } = require("express");
const { authenticateJWT, authorizeRoles } = require("../middleware/authMiddleware");
const {
  listCategories,
  createCategory,
  updateCategory,
} = require("../controllers/categoryController");

const router = Router();

router.get(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  listCategories
);

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  createCategory
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  updateCategory
);

module.exports = router;
