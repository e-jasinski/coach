'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('profiles', 'playingFrequency', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'e.g., "Once a week", "Twice a month"'
    });

    await queryInterface.addColumn('profiles', 'yearsPlaying', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'goals', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'e.g., "Break 80", "Improve consistency"'
    });

    // Full Swing Fields
    await queryInterface.addColumn('profiles', 'driverMisses', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      comment: 'e.g., ["Slice", "Hook", "Push", "Pull", "Thin", "Fat", "Sky"]'
    });

    await queryInterface.addColumn('profiles', 'driverMissDescription', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'driverStrengthRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating'
    });

    await queryInterface.addColumn('profiles', 'ironMisses', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      comment: 'e.g., ["Slice", "Hook", "Push", "Pull", "Thin", "Fat"]'
    });

    await queryInterface.addColumn('profiles', 'ironMissDescription', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'ironStrengthRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating (accuracy/distance control)'
    });

    await queryInterface.addColumn('profiles', 'swingFocus', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Current technical focus'
    });

    // Short Game Fields
    await queryInterface.addColumn('profiles', 'shortGameMisses', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      comment: 'e.g., ["Thin", "Fat", "Poor Distance", "Wrong Club"]'
    });

    await queryInterface.addColumn('profiles', 'shortGameDescription', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'chippingRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating'
    });

    await queryInterface.addColumn('profiles', 'pitchingRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating'
    });

    await queryInterface.addColumn('profiles', 'bunkerRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating'
    });

    // Putting Fields
    await queryInterface.addColumn('profiles', 'puttingMisses', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      comment: 'e.g., ["Poor Speed", "Pushed", "Pulled", "3-Putts"]'
    });

    await queryInterface.addColumn('profiles', 'puttingDescription', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'shortPuttRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating (<6ft)'
    });

    await queryInterface.addColumn('profiles', 'mediumPuttRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating (6-20ft)'
    });

    await queryInterface.addColumn('profiles', 'lagPuttRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating (>20ft)'
    });

    await queryInterface.addColumn('profiles', 'greenReadingRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '1-5 rating'
    });

    // Mental Game Fields
    await queryInterface.addColumn('profiles', 'mentalStrengths', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      comment: 'e.g., ["Focus", "Pressure Handling", "Recovery", "Course Mgmt"]'
    });

    await queryInterface.addColumn('profiles', 'mentalWeaknesses', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      comment: 'e.g., ["Focus", "Pressure Handling", "Recovery", "Course Mgmt"]'
    });

    await queryInterface.addColumn('profiles', 'mentalGameNotes', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Equipment Fields
    await queryInterface.addColumn('profiles', 'driverInfo', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'ironInfo', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'wedgeInfo', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('profiles', 'putterInfo', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Remove deprecated field
    await queryInterface.removeColumn('profiles', 'missDescription');
  },

  down: async (queryInterface, Sequelize) => {
    // Add back the deprecated field
    await queryInterface.addColumn('profiles', 'missDescription', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Remove all new fields in reverse order
    const fieldsToRemove = [
      'putterInfo', 'wedgeInfo', 'ironInfo', 'driverInfo',
      'mentalGameNotes', 'mentalWeaknesses', 'mentalStrengths',
      'greenReadingRating', 'lagPuttRating', 'mediumPuttRating',
      'shortPuttRating', 'puttingDescription', 'puttingMisses',
      'bunkerRating', 'pitchingRating', 'chippingRating',
      'shortGameDescription', 'shortGameMisses',
      'swingFocus', 'ironStrengthRating', 'ironMissDescription',
      'ironMisses', 'driverStrengthRating', 'driverMissDescription',
      'driverMisses', 'goals', 'yearsPlaying', 'playingFrequency'
    ];

    for (const field of fieldsToRemove) {
      await queryInterface.removeColumn('profiles', field);
    }
  }
}; 