'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
      },
      profilePicUrl: {
        type: Sequelize.STRING
      },
      missDescription: {
        type: Sequelize.TEXT
      },
      preShotRoutine: {
        type: Sequelize.TEXT
      },
      favoriteThoughts: {
        type: Sequelize.TEXT
      },
      homeCourse: {
        type: Sequelize.STRING
      },
      handicap: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profiles');
  }
};