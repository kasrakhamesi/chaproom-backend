'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      label: { type: Sequelize.STRING, allowNull: false },
      recipientName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recipientPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recipientPostalCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recipientDeliveryProvince: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recipientDeliveryCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recipientDeliveryAddress: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addresses')
  }
}
