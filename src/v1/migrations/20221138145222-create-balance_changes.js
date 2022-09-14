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
          type: Sequelize.BIGINT,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        orderId: {
          type: Sequelize.BIGINT,
          references: { model: 'orders', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        adminId: {
          type: Sequelize.INTEGER,
          references: { model: 'admins', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        type: {
          type: Sequelize.ENUM(
            'deposit',
            'withdraw',
            'increase_by_admin',
            'decrease_by_admin'
          ),
          allowNull: false
        },
        balance_before: {
          type: Sequelize.STRING,
          allowNull: false
        },
        balance: {
          type: Sequelize.STRING,
          allowNull: false
        },
        balance_after: {
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
        created_date: {
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
