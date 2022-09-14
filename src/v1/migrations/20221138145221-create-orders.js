'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('orders', {
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
        type: {
          type: Sequelize.ENUM('deposit', 'withdraw'),
          allowNull: false
        },
        gatewayId: {
          type: Sequelize.INTEGER,
          references: { model: 'gateways', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
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
        amount: {
          type: Sequelize.STRING,
          allowNull: true
        },
        ref_number: {
          type: Sequelize.STRING,
          allowNull: true
        },
        res_number: {
          type: Sequelize.STRING,
          allowNull: true
        },
        bank_terminal_number: {
          type: Sequelize.STRING,
          allowNull: true
        },
        bank_status: {
          type: Sequelize.STRING,
          allowNull: true
        },
        bank_amount: {
          type: Sequelize.STRING,
          allowNull: true
        },
        bank_rrn: {
          type: Sequelize.STRING,
          allowNull: true
        },
        bank_response: {
          type: Sequelize.JSON,
          allowNull: true
        },
        bank_verify_response: {
          type: Sequelize.JSON,
          allowNull: true
        },
        payout_track_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        payout_order_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true
        },
        created_date: {
          type: Sequelize.STRING,
          allowNull: true
        },
        payment_token: {
          type: Sequelize.STRING,
          allowNull: true
        },
        is_token_used: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
      .then(() => queryInterface.addIndex('orders', ['id'], { unique: true }))
      .then(() =>
        queryInterface.addIndex('orders', ['payment_token'], { unique: true })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders')
  }
}
