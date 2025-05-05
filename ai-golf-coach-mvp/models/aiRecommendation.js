'use strict';

module.exports = (sequelize, DataTypes) => {
  const AIRecommendation = sequelize.define('AIRecommendation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    // Store the user's request
    focusArea: { type: DataTypes.STRING, allowNull: false }, // e.g., 'Driving', 'Putting'
    adviceType: { type: DataTypes.STRING, allowNull: false }, // e.g., 'Practice Drills', 'Mental Strategy'
    
    // Store the result
    recommendations: { type: DataTypes.TEXT, allowNull: false }, // The AI-generated text

    // Legacy field - kept for backward compatibility
    context: { type: DataTypes.JSONB, allowNull: true, defaultValue: {} },

    // Optional: Store context for debugging/review
    promptUsed: { type: DataTypes.TEXT },
    profileContext: { type: DataTypes.JSONB }, 
    sessionContext: { type: DataTypes.JSONB },

  }, { 
    tableName: 'ai_recommendations',
    timestamps: true
  });

  return AIRecommendation;
}; 