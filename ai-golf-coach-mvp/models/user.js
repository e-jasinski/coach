const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  resetToken: { type: DataTypes.UUID },
  resetExpires: { type: DataTypes.DATE },
}, {
  tableName: 'users',
});

module.exports = User;
