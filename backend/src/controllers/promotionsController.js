const {
  Promotion,
  Product,
  Category,
  PromotionProduct,
  PromotionCategory,
  Log,
} = require("../../models");

/* -----------------------------
  Includes helper
----------------------------- */
function promoIncludes() {
  const inc = [
    {
      model: Product,
      as: "products",
      through: { attributes: [] },
      required: false,
    },
  ];

  // Only include categories if your models exist and association is enabled
  if (Category && PromotionCategory) {
    inc.push({
      model: Category,
      as: "categories",
      through: { attributes: [] },
      required: false,
    });
  }

  return inc;
}

/* -----------------------------
  Audit Log helper (never breaks flow)
----------------------------- */
async function writeLog(req, action, detailsObj) {
  try {
    if (!Log) return;

    await Log.create({
      userId: req.user?.id ?? null,
      action,
      details: JSON.stringify(detailsObj ?? {}),
    });
  } catch (e) {
    console.warn("LOG WRITE FAILED:", e.message);
  }
}

module.exports = {
  /* -----------------------------
    LIST
  ----------------------------- */
  async list(req, res, next) {
    try {
      const promos = await Promotion.findAll({
        order: [["createdAt", "DESC"]],
        include: promoIncludes(),
      });

      return res.json(promos);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        original: err.original?.message || err.original || null,
      });
    }
  },

  /* -----------------------------
    GET ONE
  ----------------------------- */
  async getOne(req, res, next) {
    try {
      const promo = await Promotion.findByPk(req.params.id, {
        include: promoIncludes(),
      });

      if (!promo) return res.status(404).json({ message: "Promotion not found" });

      return res.json(promo);
    } catch (err) {
      next(err);
    }
  },

  /* -----------------------------
    CREATE
  ----------------------------- */
  async create(req, res, next) {
    try {
      const payload = {
        name: req.body.name,
        type: req.body.type,
        value: req.body.value ?? null,
        config_json: req.body.config_json ?? null,
        start_date: req.body.start_date ?? null,
        end_date: req.body.end_date ?? null,
        status: req.body.status ?? "INACTIVE",
      };

      const promo = await Promotion.create(payload);

      await writeLog(req, "PROMOTION_CREATED", {
        promotionId: promo.id,
        name: promo.name,
        type: promo.type,
        status: promo.status,
      });

      const created = await Promotion.findByPk(promo.id, {
        include: promoIncludes(),
      });

      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  /* -----------------------------
    UPDATE
  ----------------------------- */
  async update(req, res, next) {
    try {
      const promo = await Promotion.findByPk(req.params.id);
      if (!promo) return res.status(404).json({ message: "Promotion not found" });

      const beforeStatus = promo.status;

      await promo.update({
        name: req.body.name ?? promo.name,
        type: req.body.type ?? promo.type,
        value: req.body.value !== undefined ? req.body.value : promo.value,
        config_json:
          req.body.config_json !== undefined ? req.body.config_json : promo.config_json,
        start_date:
          req.body.start_date !== undefined ? req.body.start_date : promo.start_date,
        end_date: req.body.end_date !== undefined ? req.body.end_date : promo.end_date,
        status: req.body.status ?? promo.status,
      });

      // Log status change separately
      if (req.body.status && req.body.status !== beforeStatus) {
        await writeLog(req, "PROMOTION_STATUS_CHANGED", {
          promotionId: promo.id,
          from: beforeStatus,
          to: promo.status,
        });
      }

      // General update log
      await writeLog(req, "PROMOTION_UPDATED", {
        promotionId: promo.id,
        fields: Object.keys(req.body || {}),
      });

      const updated = await Promotion.findByPk(promo.id, {
        include: promoIncludes(),
      });

      return res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  /* -----------------------------
    DELETE
  ----------------------------- */
  async remove(req, res, next) {
    try {
      const promo = await Promotion.findByPk(req.params.id);
      if (!promo) return res.status(404).json({ message: "Promotion not found" });

      // capture values before deletion
      const snapshot = { id: promo.id, name: promo.name, type: promo.type };

      await promo.destroy();

      await writeLog(req, "PROMOTION_DELETED", {
        promotionId: snapshot.id,
        name: snapshot.name,
        type: snapshot.type,
      });

      return res.json({ message: "Promotion deleted" });
    } catch (err) {
      next(err);
    }
  },

  /* -----------------------------
    SET PRODUCTS (replace)
  ----------------------------- */
  async setProducts(req, res, next) {
    try {
      const promoId = Number(req.params.id);
      const { productIds } = req.body;

      const promo = await Promotion.findByPk(promoId);
      if (!promo) return res.status(404).json({ message: "Promotion not found" });

      // ensure products exist
      const found = await Product.findAll({ where: { id: productIds } });
      if (found.length !== productIds.length) {
        return res.status(422).json({ message: "One or more productIds do not exist" });
      }

      await PromotionProduct.destroy({ where: { promotion_id: promoId } });

      if (productIds.length > 0) {
        const rows = productIds.map((pid) => ({
          promotion_id: promoId,
          product_id: pid,
        }));
        await PromotionProduct.bulkCreate(rows);
      }

      await writeLog(req, "PROMOTION_PRODUCTS_ASSIGNED", {
        promotionId: promoId,
        productIds,
        count: productIds.length,
      });

      const updated = await Promotion.findByPk(promoId, {
        include: promoIncludes(),
      });

      return res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  /* -----------------------------
    SET CATEGORIES (replace)
  ----------------------------- */
  async setCategories(req, res, next) {
    try {
      if (!Category || !PromotionCategory) {
        return res.status(400).json({ message: "Category targeting is not enabled" });
      }

      const promoId = Number(req.params.id);
      const { categoryIds } = req.body;

      const promo = await Promotion.findByPk(promoId);
      if (!promo) return res.status(404).json({ message: "Promotion not found" });

      const found = await Category.findAll({ where: { id: categoryIds } });
      if (found.length !== categoryIds.length) {
        return res.status(422).json({ message: "One or more categoryIds do not exist" });
      }

      await PromotionCategory.destroy({ where: { promotion_id: promoId } });

      if (categoryIds.length > 0) {
        const rows = categoryIds.map((cid) => ({
          promotion_id: promoId,
          category_id: cid,
        }));
        await PromotionCategory.bulkCreate(rows);
      }

      await writeLog(req, "PROMOTION_CATEGORIES_ASSIGNED", {
        promotionId: promoId,
        categoryIds,
        count: categoryIds.length,
      });

      const updated = await Promotion.findByPk(promoId, {
        include: promoIncludes(),
      });

      return res.json(updated);
    } catch (err) {
      next(err);
    }
  },
};
