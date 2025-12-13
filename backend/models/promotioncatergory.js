'use strict';

module.exports = (sequelize, DataTypes) => {
  const PromotionCategory = sequelize.define(
    'PromotionCategory',
    {
      promotion_id: { type: DataTypes.INTEGER, allowNull: false },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'promotion_categories',
      underscored: true,
    }
  );

  return PromotionCategory;
};
