module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(200), allowNull: false },

      sku: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      barcode: { type: DataTypes.STRING(80), allowNull: true, unique: true },

      category_id: { type: DataTypes.INTEGER, allowNull: false },

      cost_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      selling_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },

      low_stock_threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

      image_url: { type: DataTypes.TEXT, allowNull: true },
      image_key: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: "products",
      timestamps: true,
      underscored: true,
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: "category_id" });
  };

  return Product;
};
