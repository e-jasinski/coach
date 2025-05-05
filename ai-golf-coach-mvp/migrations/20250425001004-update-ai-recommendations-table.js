'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ai_recommendations', 'focusArea', { type: Sequelize.STRING, allowNull: true }); // Set allowNull: false later if desired
    await queryInterface.addColumn('ai_recommendations', 'adviceType', { type: Sequelize.STRING, allowNull: true }); // Set allowNull: false later if desired
    await queryInterface.addColumn('ai_recommendations', 'promptUsed', { type: Sequelize.TEXT });
    await queryInterface.addColumn('ai_recommendations', 'profileContext', { type: Sequelize.JSONB });
    await queryInterface.addColumn('ai_recommendations', 'sessionContext', { type: Sequelize.JSONB });

    // If you had a generic 'context' column you want to remove:
    // await queryInterface.removeColumn('ai_recommendations', 'context');

    // If making fields required:
    // await queryInterface.changeColumn('ai_recommendations', 'focusArea', { type: Sequelize.STRING, allowNull: false });
    // await queryInterface.changeColumn('ai_recommendations', 'adviceType', { type: Sequelize.STRING, allowNull: false });
    // await queryInterface.changeColumn('ai_recommendations', 'recommendations', { type: Sequelize.TEXT, allowNull: false });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ai_recommendations', 'focusArea');
    await queryInterface.removeColumn('ai_recommendations', 'adviceType');
    await queryInterface.removeColumn('ai_recommendations', 'promptUsed');
    await queryInterface.removeColumn('ai_recommendations', 'profileContext');
    await queryInterface.removeColumn('ai_recommendations', 'sessionContext');

    // Add back old column if removed:
    // await queryInterface.addColumn('ai_recommendations', 'context', { type: Sequelize.JSONB });
  }
};