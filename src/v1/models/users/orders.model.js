'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orders.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('deposit', 'withdraw'),
        allowNull: false
      },
      gatewayId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'approved',
          'rejected',
          'canceled',
          'hold'
        ),
        allowNull: false
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ref_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      res_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bank_terminal_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bank_status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bank_amount: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bank_rrn: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bank_response: {
        type: DataTypes.JSON,
        allowNull: true
      },
      bank_verify_response: {
        type: DataTypes.JSON,
        allowNull: true
      },
      payout_track_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      payout_order_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_date: {
        type: DataTypes.STRING,
        allowNull: true
      },
      payment_token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_token_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'orders'
    }
  )
  return orders
}
