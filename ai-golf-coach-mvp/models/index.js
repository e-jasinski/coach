const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import model functions
const UserModel = require('./user');
const ProfileModel = require('./profile');
const JournalEntryModel = require('./journalEntry');
const AIRecommendationModel = require('./aiRecommendation');

// Initialize models with sequelize
const User = UserModel(sequelize, DataTypes);
const Profile = ProfileModel(sequelize, DataTypes);
const JournalEntry = JournalEntryModel(sequelize, DataTypes);
const AIRecommendation = AIRecommendationModel(sequelize, DataTypes);

// Set up associations
User.hasMany(JournalEntry, { foreignKey: 'userId' });
User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(AIRecommendation, { foreignKey: 'userId', onDelete: 'CASCADE' });

Profile.belongsTo(User, { foreignKey: 'userId' });
JournalEntry.belongsTo(User, { foreignKey: 'userId' });
AIRecommendation.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Profile,
  JournalEntry,
  AIRecommendation,
};
