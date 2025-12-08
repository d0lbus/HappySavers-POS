'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    }

    async validatePassword(password) {
      if (!this.passwordHash) return false;
      return bcrypt.compare(password, this.passwordHash);
    }

    async validatePin(pin) {
      if (!this.pinPassword) return false;
      return bcrypt.compare(pin, this.pinPassword);
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      username: { type: DataTypes.STRING, unique: true },
      passwordHash: DataTypes.STRING,
      pinPassword: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      hooks: {
        beforeCreate: async (user) => {
          if (user.passwordHash && !user.passwordHash.startsWith('$2b$')) {
            user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
          }
          if (user.pinPassword && !user.pinPassword.startsWith('$2b$')) {
            user.pinPassword = await bcrypt.hash(user.pinPassword, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('passwordHash') && user.passwordHash && !user.passwordHash.startsWith('$2b$')) {
            user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
          }
          if (user.changed('pinPassword') && user.pinPassword && !user.pinPassword.startsWith('$2b$')) {
            user.pinPassword = await bcrypt.hash(user.pinPassword, 10);
          }
        },
      },
    }
  );

  return User;
};
