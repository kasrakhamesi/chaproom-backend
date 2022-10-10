'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('discount_usages', {
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
          allowNull: true
        },
        orderId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'orders', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        discountId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'discounts', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
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
      .then(() =>
        queryInterface.addIndex(
          'discount_usages',
          ['userId', 'orderId', 'discountId'],
          {
            unique: true
          }
        )
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('discount_usages')
  }
}
