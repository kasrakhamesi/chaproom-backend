'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'contact_us',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phoneNumber: {
          type: Sequelize.STRING,
          allowNull: false
        },
        message: {
          type: Sequelize.TEXT('medium'),
          allowNull: false
        },
        checked: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
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
      },
      { freezeTableName: true }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('contact_us')
  }
}
