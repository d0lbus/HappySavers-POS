const { sequelize, Product, StockMovement, Log } = require("../../models");
const { literal } = require("sequelize");

function currentStockLiteral() {
  return literal(`
    COALESCE(
      SUM(
        CASE
          WHEN stockMovements.direction = 'IN' THEN stockMovements.quantity
          ELSE -stockMovements.quantity
        END
      ),
    0)
  `);
}

async function getCurrentStock(productId, transaction) {
  const rows = await StockMovement.findAll({
    where: { product_id: productId },
    attributes: [[
      literal(`
        COALESCE(
          SUM(CASE WHEN direction='IN' THEN quantity ELSE -quantity END),
        0)
      `),
      "current_stock",
    ]],
    raw: true,
    transaction,
  });

  return Number(rows?.[0]?.current_stock || 0);
}

async function listInventory(req, res) {
  try {
    const products = await Product.findAll({
      attributes: {
        include: [[currentStockLiteral(), "current_stock"]],
      },
      include: [
        {
          model: StockMovement,
          as: "stockMovements",
          attributes: [],
          required: false,
        },
      ],
      group: ["Product.id"],
      order: [["name", "ASC"]],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

async function adjustStock(req, res) {
  const { product_id, direction, quantity, movement_type = "ADJUST", reason = null, notes = null } = req.body;
  const userId = req.user?.id || null;

  if (!Number.isInteger(product_id)) {
    return res.status(400).json({ message: "product_id must be an integer" });
  }

  if (!["IN", "OUT"].includes(direction)) {
    return res.status(400).json({ message: "direction must be IN or OUT" });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "quantity must be a positive integer" });
  }

  try {
    await sequelize.transaction(async (t) => {
      const before = await getCurrentStock(product_id, t);

      if (direction === "OUT" && before - quantity < 0) {
        throw new Error("Stock cannot go negative");
      }

      const movement = await StockMovement.create(
        {
          product_id,
          movement_type,
          direction,
          quantity,
          reason,
          notes,
          reference_type: "MANUAL",
          reference_id: null,
          created_by: userId,
        },
        { transaction: t }
      );

      const after = direction === "IN" ? before + quantity : before - quantity;

      if (!Log) {
      } else {
        await Log.create(
          {
            userId,
            action: "inventory.adjust",
            details: JSON.stringify({
              product_id,
              movement_id: movement.id,
              movement_type,
              direction,
              quantity,
              before,
              after,
              reason,
            }),
          },
          { transaction: t }
        );
      }

      res.json({ success: true, movement, before, after });
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Adjustment failed" });
  }
}

async function listMovements(req, res) {
  try {
    const movements = await StockMovement.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "sku", "barcode", "low_stock_threshold", "is_active"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

async function listLowStock(req, res) {
  try {
    const rows = await Product.findAll({
      attributes: {
        include: [[currentStockLiteral(), "current_stock"]],
      },
      include: [
        {
          model: StockMovement,
          as: "stockMovements",
          attributes: [],
          required: false,
        },
      ],
      group: ["Product.id"],
      having: literal(`current_stock <= low_stock_threshold`),
      order: [["name", "ASC"]],
    });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}

module.exports = {
  listInventory,
  adjustStock,
  listMovements,
  listLowStock,
};
