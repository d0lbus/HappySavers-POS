'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('promotions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      name: { type: Sequelize.STRING(120), allowNull: false },

      // Phase B: define types, but do not apply at checkout yet
      type: {
        type: Sequelize.ENUM('PERCENT', 'FIXED', 'BOGO', 'BUNDLE'),
        allowNull: false,
      },

      // For PERCENT/FIXED you can use value; for BOGO/BUNDLE keep it null and store config in config_json
      value: { type: Sequelize.DECIMAL(10, 2), allowNull: true },

      // For complex types (BOGO/BUNDLE), store the rule structure here in Phase B
      config_json: { type: Sequelize.JSON, allowNull: true },

      start_date: { type: Sequelize.DATE, allowNull: true },
      end_date: { type: Sequelize.DATE, allowNull: true },

      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'INACTIVE',
      },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('promotions');
  },
};
