'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('roles', [
      {
        name: 'Admin',
        description: 'Full system access',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Cashier',
        description: 'Can process sales and view limited data',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Manager',
        description: 'Can view reports and manage inventory',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
