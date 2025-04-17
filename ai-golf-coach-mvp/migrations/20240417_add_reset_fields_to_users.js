'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'resetToken', Sequelize.UUID);
    await queryInterface.addColumn('users', 'resetExpires', Sequelize.DATE);
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'resetToken');
    await queryInterface.removeColumn('users', 'resetExpires');
  }
}; 