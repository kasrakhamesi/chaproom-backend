'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('balance_changes', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
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
          allowNull: true
        },
        adminId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'admins', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        type: {
          type: Sequelize.ENUM('deposit', 'withdrawal'),
          allowNull: false
        },
        balanceBefore: {
          type: Sequelize.STRING,
          allowNull: false
        },
        balance: {
          type: Sequelize.STRING,
          allowNull: false
        },
        balanceAfter: {
          type: Sequelize.STRING,
          allowNull: false
        },
        amount: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
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
        queryInterface.addIndex('balance_changes', ['orderId'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('balance_changes')
  }
}
