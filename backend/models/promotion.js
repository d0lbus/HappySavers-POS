'use strict';

module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define(
    'Promotion',
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      type: { type: DataTypes.ENUM('PERCENT', 'FIXED', 'BOGO', 'BUNDLE'), allowNull: false },
      value: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      config_json: { type: DataTypes.JSON, allowNull: true },
      start_date: { type: DataTypes.DATE, allowNull: true },
      end_date: { type: DataTypes.DATE, allowNull: true },
      status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'INACTIVE' },
    },
    {
      tableName: 'promotions',
      underscored: true,
    }
  );

  Promotion.associate = (models) => {
    Promotion.belongsToMany(models.Product, {
      through: models.PromotionProduct,
      foreignKey: 'promotion_id',
      otherKey: 'product_id',
      as: 'products',
    });

    if (models.Category && models.PromotionCategory) {
      Promotion.belongsToMany(models.Category, {
        through: models.PromotionCategory,
        foreignKey: 'promotion_id',
        otherKey: 'category_id',
        as: 'categories',
      });
    }
  };

  return Promotion;
};
