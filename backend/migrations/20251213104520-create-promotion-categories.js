'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('promotion_categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      promotion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'promotions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('promotion_categories', {
      fields: ['promotion_id', 'category_id'],
      type: 'unique',
      name: 'uniq_promotion_categories_promotion_category',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('promotion_categories');
  },
};
