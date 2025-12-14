const express = require("express");
const router = express.Router();

const { authenticateJWT, authorizeRoles } = require("../middleware/authMiddleware");

const PromotionsController = require("../controllers/promotionsController");
const { validate } = require("../middleware/validate");
const {
  createPromotionRules,
  updatePromotionRules,
  idParamRules,
  assignProductsRules,
  assignCategoriesRules,
} = require("../validators/promotionValidator");

// CRUD
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  PromotionsController.list
);

router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  validate(idParamRules),
  PromotionsController.getOne
);

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  validate(createPromotionRules),
  PromotionsController.create
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  validate([...idParamRules, ...updatePromotionRules]),
  PromotionsController.update
);

router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  validate(idParamRules),
  PromotionsController.remove
);

// Assign targets (Phase B)
router.post(
  "/:id/products",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  validate([...idParamRules, ...assignProductsRules]),
  PromotionsController.setProducts
);

router.post(
  "/:id/categories",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  validate([...idParamRules, ...assignCategoriesRules]),
  PromotionsController.setCategories
);

module.exports = router;
