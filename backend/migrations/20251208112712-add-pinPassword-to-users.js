'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'pinPassword', {
      type: Sequelize.STRING(255),
      allowNull: true,
      // you can add comment if you like:
      // comment: 'Hashed numeric PIN for quick POS login',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'pinPassword');
  },
};
