'use strict';
module.exports = (sequelize, DataTypes) => {
  const StockMovement = sequelize.define(
    'StockMovement',
    {
      product_id: DataTypes.INTEGER,
      movement_type: DataTypes.STRING,
      direction: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      reason: DataTypes.STRING,
      notes: DataTypes.TEXT,
      reference_type: DataTypes.STRING,
      reference_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
    },
    {
      tableName: 'stock_movements',
      underscored: true,
      paranoid: true,
    }
  );

    StockMovement.associate = (models) => {
    StockMovement.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
    });

    const UserModel = models.User || models.user; 

    if (UserModel) {
        StockMovement.belongsTo(UserModel, {
        foreignKey: 'created_by',
        as: 'creator',
        });
    }
    };


  return StockMovement;
};
