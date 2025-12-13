const express = require('express');
const router = express.Router();

const PromotionsController = require('../controllers/promotionsController');
const { validate } = require('../middleware/validate');
const {
  createPromotionRules,
  updatePromotionRules,
  idParamRules,
  assignProductsRules,
  assignCategoriesRules,
} = require('../validators/promotionValidator');

// CRUD
router.get('/', PromotionsController.list);
router.get('/:id', validate(idParamRules), PromotionsController.getOne);
router.post('/', validate(createPromotionRules), PromotionsController.create);
router.put('/:id', validate([...idParamRules, ...updatePromotionRules]), PromotionsController.update);
router.delete('/:id', validate(idParamRules), PromotionsController.remove);

// Assign targets (Phase B)
router.post('/:id/products', validate([...idParamRules, ...assignProductsRules]), PromotionsController.setProducts);
router.post('/:id/categories', validate([...idParamRules, ...assignCategoriesRules]), PromotionsController.setCategories);

module.exports = router;
