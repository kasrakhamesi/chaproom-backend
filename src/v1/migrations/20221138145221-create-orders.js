'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
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
      addressId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'addresses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'approved',
          'rejected',
          'canceled',
          'hold'
        ),
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
        allowNull: false
      },
      binding: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      numberOfCopies: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      shipmentPrice: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telegramUploadFile: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      whatsupUploadFile: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      payment: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      discountId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'addresses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true
      },
      discountType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      discountValue: {
        type: Sequelize.STRING,
        allowNull: true
      },
      discountCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      discountAmount: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cancelReason: {
        type: Sequelize.STRING,
        allowNull: true
      },
      adminId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'admins', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true
      },
      compeleteAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      sentAt: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('orders')
  }
}
