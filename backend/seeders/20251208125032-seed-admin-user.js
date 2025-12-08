'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Check if admin already exists
    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'admin' LIMIT 1;`
    );

    if (existing.length > 0) {
      // admin already there, do nothing
      return;
    }

    // 2) Ensure there is an Admin role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Admin' LIMIT 1;`
    );

    if (!roles.length) {
      throw new Error("Admin role not found in roles table");
    }

    const adminRoleId = roles[0].id;

    // 3) Hash password & PIN
    const passwordHash = await bcrypt.hash('admin123', 10);
    const pinHash = await bcrypt.hash('1234', 10);

    // 4) Insert admin user
    await queryInterface.bulkInsert('users', [
      {
        name: 'System Admin',
        username: 'admin',
        passwordHash: passwordHash,
        pinPassword: pinHash,
        roleId: adminRoleId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' });
  },
};
