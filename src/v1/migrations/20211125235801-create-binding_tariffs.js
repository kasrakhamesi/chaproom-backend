'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('binding_tariffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      a4_springNormal: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      a5_springNormal: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      a3_springNormal: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      a5_springPapco: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      a4_springPapco: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      a3_springPapco: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      stapler: {
        type: Sequelize.INTEGER.UNSIGNED,
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
    await queryInterface.dropTable('binding_tariffs')
  }
}
