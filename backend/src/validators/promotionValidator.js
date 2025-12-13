const { body, param } = require('express-validator');

const idParamRules = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

const createPromotionRules = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }),
  body('type').isIn(['PERCENT', 'FIXED', 'BOGO', 'BUNDLE']),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']),

  body('start_date').optional({ nullable: true }).isISO8601(),
  body('end_date').optional({ nullable: true }).isISO8601(),

  // Value only for PERCENT/FIXED
  body('value')
    .optional({ nullable: true })
    .custom((v, { req }) => {
      const type = req.body.type;
      if (type === 'PERCENT' || type === 'FIXED') {
        if (v === null || v === undefined) return true;
        const n = Number(v);
        if (Number.isNaN(n)) throw new Error('value must be numeric');
        if (type === 'PERCENT' && (n <= 0 || n > 100)) throw new Error('PERCENT value must be 1-100');
        if (type === 'FIXED' && n <= 0) throw new Error('FIXED value must be > 0');
      }
      return true;
    }),

  // config_json recommended for BOGO/BUNDLE
  body('config_json')
    .optional({ nullable: true })
    .custom((v) => {
      if (v === null || v === undefined) return true;
      if (typeof v !== 'object') throw new Error('config_json must be an object');
      return true;
    }),
];

const updatePromotionRules = [
  body('name').optional().isString().trim().isLength({ min: 2, max: 120 }),
  body('type').optional().isIn(['PERCENT', 'FIXED', 'BOGO', 'BUNDLE']),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  body('start_date').optional({ nullable: true }).isISO8601(),
  body('end_date').optional({ nullable: true }).isISO8601(),
  body('value').optional({ nullable: true }),
  body('config_json').optional({ nullable: true }),
];

const assignProductsRules = [
  body('productIds')
    .isArray({ min: 0 })
    .withMessage('productIds must be an array'),
  body('productIds.*')
    .isInt({ min: 1 })
    .withMessage('Each product id must be a positive integer'),
];

const assignCategoriesRules = [
  body('categoryIds')
    .isArray({ min: 0 })
    .withMessage('categoryIds must be an array'),
  body('categoryIds.*')
    .isInt({ min: 1 })
    .withMessage('Each category id must be a positive integer'),
];

module.exports = {
  idParamRules,
  createPromotionRules,
  updatePromotionRules,
  assignProductsRules,
  assignCategoriesRules,
};
