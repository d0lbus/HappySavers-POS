const { Promotion, Product, Category, PromotionProduct, PromotionCategory } = require('../../models');

function promoIncludes() {
  const inc = [
    { model: Product, as: 'products', through: { attributes: [] }, required: false },
  ];

  if (Category && PromotionCategory) {
    inc.push({ model: Category, as: 'categories', through: { attributes: [] }, required: false });
  }

  return inc;
}

module.exports = {
  async list(req, res, next) {
    try {
    const promos = await Promotion.findAll(/* ... */);
    return res.json(promos);
  } catch (err) {
    console.log("PROMOTIONS LIST ERROR MESSAGE:", err.message);
    console.log("PROMOTIONS LIST ERROR ORIGINAL:", err.original);
    console.log("PROMOTIONS LIST ERROR SQL:", err.sql);
    return res.status(500).json({
      message: err.message,
      original: err.original?.message || err.original || null,
    });
    }
  },

  async getOne(req, res, next) {
    try {
      const promo = await Promotion.findByPk(req.params.id, { include: promoIncludes() });
      if (!promo) return res.status(404).json({ message: 'Promotion not found' });
      res.json(promo);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = {
        name: req.body.name,
        type: req.body.type,
        value: req.body.value ?? null,
        config_json: req.body.config_json ?? null,
        start_date: req.body.start_date ?? null,
        end_date: req.body.end_date ?? null,
        status: req.body.status ?? 'INACTIVE',
      };

      const promo = await Promotion.create(payload);
      const created = await Promotion.findByPk(promo.id, { include: promoIncludes() });
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const promo = await Promotion.findByPk(req.params.id);
      if (!promo) return res.status(404).json({ message: 'Promotion not found' });

      await promo.update({
        name: req.body.name ?? promo.name,
        type: req.body.type ?? promo.type,
        value: req.body.value !== undefined ? req.body.value : promo.value,
        config_json: req.body.config_json !== undefined ? req.body.config_json : promo.config_json,
        start_date: req.body.start_date !== undefined ? req.body.start_date : promo.start_date,
        end_date: req.body.end_date !== undefined ? req.body.end_date : promo.end_date,
        status: req.body.status ?? promo.status,
      });

      const updated = await Promotion.findByPk(promo.id, { include: promoIncludes() });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const promo = await Promotion.findByPk(req.params.id);
      if (!promo) return res.status(404).json({ message: 'Promotion not found' });

      await promo.destroy();
      res.json({ message: 'Promotion deleted' });
    } catch (err) {
      next(err);
    }
  },

  // Replace all assigned products with provided list (simple + clean for Phase B)
  async setProducts(req, res, next) {
    try {
      const promoId = Number(req.params.id);
      const { productIds } = req.body;

      const promo = await Promotion.findByPk(promoId);
      if (!promo) return res.status(404).json({ message: 'Promotion not found' });

      // ensure products exist
      const found = await Product.findAll({ where: { id: productIds } });
      if (found.length !== productIds.length) {
        return res.status(422).json({ message: 'One or more productIds do not exist' });
      }

      await PromotionProduct.destroy({ where: { promotion_id: promoId } });

      if (productIds.length > 0) {
        const rows = productIds.map((pid) => ({ promotion_id: promoId, product_id: pid }));
        await PromotionProduct.bulkCreate(rows);
      }

      const updated = await Promotion.findByPk(promoId, { include: promoIncludes() });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  // Replace categories list (optional feature)
  async setCategories(req, res, next) {
    try {
      if (!Category || !PromotionCategory) {
        return res.status(400).json({ message: 'Category targeting is not enabled' });
      }

      const promoId = Number(req.params.id);
      const { categoryIds } = req.body;

      const promo = await Promotion.findByPk(promoId);
      if (!promo) return res.status(404).json({ message: 'Promotion not found' });

      const found = await Category.findAll({ where: { id: categoryIds } });
      if (found.length !== categoryIds.length) {
        return res.status(422).json({ message: 'One or more categoryIds do not exist' });
      }

      await PromotionCategory.destroy({ where: { promotion_id: promoId } });

      if (categoryIds.length > 0) {
        const rows = categoryIds.map((cid) => ({ promotion_id: promoId, category_id: cid }));
        await PromotionCategory.bulkCreate(rows);
      }

      const updated = await Promotion.findByPk(promoId, { include: promoIncludes() });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
};
