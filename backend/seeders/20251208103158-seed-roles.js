'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Read existing roles
    const [existing] = await queryInterface.sequelize.query(
      'SELECT name FROM roles;'
    );
    const existingNames = existing.map((r) => r.name);

    const now = new Date();
    const rolesToInsert = [];

    if (!existingNames.includes('Admin')) {
      rolesToInsert.push({
        name: 'Admin',
        description: 'System administrator',
        createdAt: now,
        updatedAt: now,
      });
    }

    if (!existingNames.includes('Cashier')) {
      rolesToInsert.push({
        name: 'Cashier',
        description: 'POS cashier',
        createdAt: now,
        updatedAt: now,
      });
    }

    if (!existingNames.includes('Manager')) {
      rolesToInsert.push({
        name: 'Manager',
        description: 'Store manager',
        createdAt: now,
        updatedAt: now,
      });
    }

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('roles', rolesToInsert);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      name: ['Admin', 'Cashier', 'Manager'],
    });
  },
};
