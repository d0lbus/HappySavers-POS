export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("products", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: Sequelize.STRING(200), allowNull: false },

    sku: { type: Sequelize.STRING(80), allowNull: false, unique: true },
    barcode: { type: Sequelize.STRING(80), allowNull: true, unique: true },

    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    cost_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    selling_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },

    low_stock_threshold: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

    is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },

    image_url: { type: Sequelize.TEXT, allowNull: true },
    image_key: { type: Sequelize.STRING(255), allowNull: true },

    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    deleted_at: { type: Sequelize.DATE, allowNull: true },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("products");
}
