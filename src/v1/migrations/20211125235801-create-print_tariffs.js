'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('print_tariffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      type: {
        type: Sequelize.ENUM('black_and_white', 'full_color', 'normal_color'),
        allowNull: false
      },
      size: {
        type: Sequelize.ENUM('a4', 'a5', 'a3'),
        allowNull: false
      },
      single_sided: {
        type: Sequelize.JSON,
        allowNull: false
      },
      double_sided: {
        type: Sequelize.JSON,
        allowNull: false
      },
      single_sided_glossy: {
        type: Sequelize.JSON,
        allowNull: false
      },
      double_sided_glossy: {
        type: Sequelize.JSON,
        allowNull: false
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('print_tariffs')
  }
}
