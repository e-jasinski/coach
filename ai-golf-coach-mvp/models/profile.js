'use strict';

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId:  { type: DataTypes.UUID, allowNull: false, unique: true },
    profilePicUrl:   DataTypes.STRING,
    missDescription: DataTypes.TEXT,
    preShotRoutine:  DataTypes.TEXT,
    favoriteThoughts:DataTypes.TEXT,
    homeCourse:      DataTypes.STRING,
    handicap:        DataTypes.FLOAT,
  }, { tableName: 'profiles' });

  return Profile;
};