module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    },
    {
      tableName: "categories",
      timestamps: true,
      underscored: true,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: "category_id" });
  };

  return Category;
};
