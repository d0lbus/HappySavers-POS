const db = require("../../models");

async function listCategories(req, res) {
  const rows = await db.Category.findAll({ order: [["name", "ASC"]] });
  res.json({ data: rows });
}

async function createCategory(req, res) {
  const name = String(req.body?.name || "").trim();
  if (!name) return res.status(422).json({ message: "Name is required" });

  const created = await db.Category.create({ name });

  await db.Log.create({
    userId: req.user.id,
    action: "CATEGORY_CREATED",
    details: `Created category "${created.name}"`,
  });

  res.status(201).json({ data: created });
}

async function updateCategory(req, res) {
  const id = Number(req.params.id);
  const name = String(req.body?.name || "").trim();

  if (!name) return res.status(422).json({ message: "Name is required" });

  const row = await db.Category.findByPk(id);
  if (!row) return res.status(404).json({ message: "Category not found" });

  const beforeName = row.name;

  await row.update({ name });

  await db.Log.create({
    userId: req.user.id,
    action: "CATEGORY_UPDATED",
    details: `Updated category ID ${row.id} from "${beforeName}" to "${name}"`,
  });

  res.json({ data: row });
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
};
