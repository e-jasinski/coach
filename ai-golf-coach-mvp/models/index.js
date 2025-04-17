const sequelize = require('../config/database');
const User = require('./user');
const ProfileModel = require('./profile');
const JournalEntry = require('./journalEntry');
const AIRecommendation = require('./aiRecommendation');

// Initialize the Profile model with sequelize
const Profile = ProfileModel(sequelize, require('sequelize').DataTypes);

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
