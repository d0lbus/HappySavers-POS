'use strict';

module.exports = (sequelize, DataTypes) => {
  const PromotionProduct = sequelize.define(
    'PromotionProduct',
    {
      promotion_id: { type: DataTypes.INTEGER, allowNull: false },
      product_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'promotion_products',
      underscored: true,
    }
  );

  return PromotionProduct;
};
