const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIRecommendation = sequelize.define('AIRecommendation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  context: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'ai_recommendations',
});

module.exports = AIRecommendation; 