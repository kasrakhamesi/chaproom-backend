'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      fileUid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      orderId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      pageCount: {
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
    await queryInterface.dropTable('files')
  }
}
