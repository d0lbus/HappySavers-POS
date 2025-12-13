'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('promotion_products', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      promotion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'promotions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('promotion_products', {
      fields: ['promotion_id', 'product_id'],
      type: 'unique',
      name: 'uniq_promotion_products_promotion_product',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('promotion_products');
  },
};
