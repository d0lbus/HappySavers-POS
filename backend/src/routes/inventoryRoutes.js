const { Router } = require("express");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  listInventory,
  adjustStock,
  listMovements,
  listLowStock,
} = require("../controllers/inventoryController");

const router = Router();

// Inventory snapshot
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  listInventory
);

// Manual stock adjustment (creates movement + audit log)
router.post(
  "/adjust",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  adjustStock
);

// Movement log
router.get(
  "/movements",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  listMovements
);

// Low stock view (<= threshold)
router.get(
  "/low-stock",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  listLowStock
);

module.exports = router;
