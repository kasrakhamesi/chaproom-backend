'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('transactions', {
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
        orderId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'orders', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        paymentId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'payments', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        withdrawalId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'withdrawals', key: 'id' },
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
          type: Sequelize.ENUM(
            'withdrawal',
            'deposit',
            'order',
            'admin',
            'marketing_discount',
            'marketing_referral'
          ),
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('successful', 'pending', 'unsuccessful'),
          allowNull: false
        },
        change: {
          type: Sequelize.ENUM('increase', 'decrease'),
          allowNull: false
        },
        balance: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false
        },
        balanceAfter: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false
        },
        amount: {
          type: Sequelize.BIGINT.UNSIGNED,
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
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addIndex('transactions', ['paymentId'], {
          unique: true
        })
      )
      .then(() =>
        queryInterface.addIndex('transactions', ['withdrawalId'], {
          unique: true
        })
      )
      .then(() =>
        queryInterface.addIndex('transactions', ['orderId', 'change'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions')
  }
}
