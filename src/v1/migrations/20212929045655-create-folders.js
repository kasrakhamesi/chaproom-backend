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
      binding: {
        type: Sequelize.JSON,
        defaultValue: null,
        allowNull: true
      },
      color: {
        type: Sequelize.ENUM('black_and_white', 'full_color', 'normal_color'),
        allowNull: false
      },
      side: {
        type: Sequelize.ENUM(
          'single_sided',
          'double_sided',
          'single_sided_glossy',
          'double_sided_glossy'
        ),
        allowNull: false
      },
      size: {
        type: Sequelize.ENUM('a4', 'a5', 'a3'),
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
      countOfFiles: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      filesUrl: {
        type: Sequelize.TEXT,
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
      used: {
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
