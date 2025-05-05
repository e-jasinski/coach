'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First make the column nullable
    await queryInterface.changeColumn('ai_recommendations', 'context', {
      type: Sequelize.JSONB,
      allowNull: true
    });

    // Then update any existing null values to an empty object
    await queryInterface.sequelize.query(`
      UPDATE ai_recommendations 
      SET context = '{}'::jsonb 
      WHERE context IS NULL
    `);
  },

  async down(queryInterface, Sequelize) {
    // First ensure no null values exist
    await queryInterface.sequelize.query(`
      UPDATE ai_recommendations 
      SET context = '{}'::jsonb 
      WHERE context IS NULL
    `);

    // Then make the column non-nullable again
    await queryInterface.changeColumn('ai_recommendations', 'context', {
      type: Sequelize.JSONB,
      allowNull: false
    });
  }
}; 