'use strict';

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    // --- Core Info ---
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, unique: true },
    profilePicUrl: DataTypes.STRING,
    homeCourse: DataTypes.STRING,
    handicap: DataTypes.FLOAT,
    playingFrequency: DataTypes.STRING, // e.g., "Once a week", "Twice a month"
    yearsPlaying: DataTypes.INTEGER,
    goals: DataTypes.TEXT, // e.g., "Break 80", "Improve consistency"

    // --- Full Swing ---
    driverMisses: { type: DataTypes.JSONB, defaultValue: '[]' }, // ['Slice', 'Hook', 'Push', 'Pull', 'Thin', 'Fat', 'Sky']
    driverMissDescription: DataTypes.TEXT,
    driverStrengthRating: DataTypes.INTEGER, // 1-5 rating
    ironMisses: { type: DataTypes.JSONB, defaultValue: '[]' }, // ['Slice', 'Hook', 'Push', 'Pull', 'Thin', 'Fat']
    ironMissDescription: DataTypes.TEXT,
    ironStrengthRating: DataTypes.INTEGER, // 1-5 rating (accuracy/distance control)
    swingFocus: DataTypes.TEXT, // Current technical focus

    // --- Short Game ---
    shortGameMisses: { type: DataTypes.JSONB, defaultValue: '[]' }, // ['Thin', 'Fat', 'Poor Distance', 'Wrong Club']
    shortGameDescription: DataTypes.TEXT, // General notes
    chippingRating: DataTypes.INTEGER, // 1-5 rating
    pitchingRating: DataTypes.INTEGER, // 1-5 rating
    bunkerRating: DataTypes.INTEGER, // 1-5 rating

    // --- Putting ---
    puttingMisses: { type: DataTypes.JSONB, defaultValue: '[]' }, // ['Poor Speed', 'Pushed', 'Pulled', '3-Putts']
    puttingDescription: DataTypes.TEXT, // General notes
    shortPuttRating: DataTypes.INTEGER, // 1-5 rating (<6ft)
    mediumPuttRating: DataTypes.INTEGER, // 1-5 rating (6-20ft)
    lagPuttRating: DataTypes.INTEGER, // 1-5 rating (>20ft)
    greenReadingRating: DataTypes.INTEGER, // 1-5 rating

    // --- Mental Game ---
    mentalStrengths: { type: DataTypes.JSONB, defaultValue: '[]' }, // ['Focus', 'Pressure Handling', 'Recovery', 'Course Mgmt']
    mentalWeaknesses: { type: DataTypes.JSONB, defaultValue: '[]' }, // ['Focus', 'Pressure Handling', 'Recovery', 'Course Mgmt']
    mentalGameNotes: DataTypes.TEXT,
    preShotRoutine: DataTypes.TEXT, // Kept from original
    favoriteThoughts: DataTypes.TEXT, // Kept from original

    // --- Equipment (Optional) ---
    driverInfo: DataTypes.STRING,
    ironInfo: DataTypes.STRING,
    wedgeInfo: DataTypes.STRING,
    putterInfo: DataTypes.STRING,

  }, {
    tableName: 'profiles',
    timestamps: true,
  });

  return Profile;
};