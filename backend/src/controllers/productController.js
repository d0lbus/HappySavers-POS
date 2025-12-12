const { Op } = require("sequelize");
const db = require("../../models");
const { deleteFile } = require("../../services/storage/storageService");

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeStatus(status) {
  const s = String(status || "active").toLowerCase();
  if (["active", "inactive", "archived"].includes(s)) return s;
  return "active";
}

async function listProducts(req, res) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));

  const q = String(req.query.q || "").trim();
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
  const status = normalizeStatus(req.query.status);

  const sortBy = String(req.query.sortBy || "name");
  const sortDir = String(req.query.sortDir || "asc").toLowerCase() === "desc"
    ? "DESC"
    : "ASC";

  const where = {};

  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { sku: { [Op.like]: `%${q}%` } },
      { barcode: { [Op.like]: `%${q}%` } },
    ];
  }

  if (categoryId) where.category_id = categoryId;
  if (status === "active") where.is_active = true;
  if (status === "inactive") where.is_active = false;

  const paranoid = status !== "archived";
  const deletedOnly = status === "archived";

  const offset = (page - 1) * limit;
  const orderAllowed = ["name", "created_at", "selling_price", "sku"];
  const safeSortBy = orderAllowed.includes(sortBy) ? sortBy : "name";

  const { rows, count } = await db.Product.findAndCountAll({
    where,
    include: [{ model: db.Category }],
    paranoid,
    ...(deletedOnly
      ? { where: { ...where, deleted_at: { [Op.not]: null } } }
      : {}),
    limit,
    offset,
    order: [[safeSortBy, sortDir]],
  });

  res.json({
    data: rows,
    meta: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  });
}

async function getProduct(req, res) {
  const id = Number(req.params.id);
  const row = await db.Product.findByPk(id, {
    paranoid: false,
    include: [{ model: db.Category }],
  });

  if (!row) return res.status(404).json({ message: "Product not found" });
  res.json({ data: row });
}

async function createProduct(req, res) {
  const payload = req.body || {};

  const name = String(payload.name || "").trim();
  const sku = String(payload.sku || "").trim();
  const barcode = payload.barcode === "" ? null : payload.barcode;
  const categoryId = Number(payload.categoryId || payload.category_id);

  if (!name) return res.status(422).json({ message: "Name is required" });
  if (!sku) return res.status(422).json({ message: "SKU is required" });
  if (!categoryId) return res.status(422).json({ message: "Category is required" });

  const costPrice = toNumber(payload.costPrice ?? payload.cost_price);
  const sellingPrice = toNumber(payload.sellingPrice ?? payload.selling_price);
  const lowStockThreshold = Math.max(
    0,
    Math.floor(toNumber(payload.lowStockThreshold ?? payload.low_stock_threshold))
  );

  if (costPrice < 0 || sellingPrice < 0) {
    return res.status(422).json({ message: "Prices must be non-negative" });
  }

  const created = await db.Product.create({
    name,
    sku,
    barcode,
    category_id: categoryId,
    cost_price: costPrice,
    selling_price: sellingPrice,
    low_stock_threshold: lowStockThreshold,
    is_active: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
    image_url: payload.imageUrl || payload.image_url || null,
    image_key: payload.imageKey || payload.image_key || null,
  });

  await db.Log.create({
    userId: req.user.id,
    action: "PRODUCT_CREATED",
    details: `Created product ${created.name} (SKU: ${created.sku})`,
  });

  res.status(201).json({ data: created });
}

async function updateProduct(req, res) {
  const id = Number(req.params.id);
  const payload = req.body || {};

  const row = await db.Product.findByPk(id, { paranoid: false });
  if (!row) return res.status(404).json({ message: "Product not found" });

  const imageChanged =
    payload.imageKey &&
    payload.imageKey !== row.image_key &&
    row.image_key;

  if (imageChanged) {
    try {
      await deleteFile({ key: row.image_key });
    } catch (e) {
      console.warn("Image delete failed:", e.message);
    }
  }

  await row.update({
    name: payload.name ?? row.name,
    sku: payload.sku ?? row.sku,
    barcode: payload.barcode === "" ? null : payload.barcode ?? row.barcode,
    category_id: payload.categoryId ?? row.category_id,
    cost_price: payload.costPrice ?? payload.cost_price ?? row.cost_price,
    selling_price: payload.sellingPrice ?? payload.selling_price ?? row.selling_price,
    low_stock_threshold:
      payload.lowStockThreshold ?? payload.low_stock_threshold ?? row.low_stock_threshold,
    is_active:
      payload.isActive !== undefined ? Boolean(payload.isActive) : row.is_active,
    image_url: payload.imageUrl ?? row.image_url,
    image_key: payload.imageKey ?? row.image_key,
  });

  await db.Log.create({
    userId: req.user.id,
    action: "PRODUCT_UPDATED",
    details: `Updated product ID ${row.id}`,
  });

  res.json({ data: row });
}

async function toggleProductStatus(req, res) {
  const id = Number(req.params.id);
  const row = await db.Product.findByPk(id, { paranoid: false });

  if (!row) return res.status(404).json({ message: "Product not found" });
  if (row.deleted_at)
    return res.status(422).json({ message: "Archived products cannot be toggled" });

  await row.update({ is_active: !row.is_active });

  await db.Log.create({
    userId: req.user.id,
    action: "PRODUCT_STATUS_CHANGED",
    details: `Toggled status for product ID ${row.id}`,
  });

  res.json({ data: row });
}

async function archiveProduct(req, res) {
  const id = Number(req.params.id);
  const row = await db.Product.findByPk(id);

  if (!row) return res.status(404).json({ message: "Product not found" });

  await row.destroy();

  await db.Log.create({
    userId: req.user.id,
    action: "PRODUCT_ARCHIVED",
    details: `Archived product ID ${id}`,
  });

  res.json({ message: "Archived" });
}

async function restoreProduct(req, res) {
  const id = Number(req.params.id);
  const row = await db.Product.findByPk(id, { paranoid: false });

  if (!row) return res.status(404).json({ message: "Product not found" });
  if (!row.deleted_at)
    return res.status(422).json({ message: "Product is not archived" });

  await row.restore();

  await db.Log.create({
    userId: req.user.id,
    action: "PRODUCT_RESTORED",
    details: `Restored product ID ${id}`,
  });

  res.json({ data: row });
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleProductStatus,
  archiveProduct,
  restoreProduct,
};
