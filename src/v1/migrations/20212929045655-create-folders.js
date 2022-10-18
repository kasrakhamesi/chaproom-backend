'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('folders', {
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
      color: {
        type: Sequelize.STRING,
        allowNull: false
      },
      side: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false
      },
      countOfPages: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      uploadedPages: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      binding: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      },
      numberOfCopies: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      },
      shipmentPrice: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      amount: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      telegramUploadFile: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      whatsappUploadFile: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('folders')
  }
}
