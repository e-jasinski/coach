const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING, // could store comma-separated tags
  },
  userId: {                       //  <── NEW
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'journal_entries',
});

module.exports = JournalEntry;