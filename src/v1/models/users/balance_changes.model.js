'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class balance_changes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  balance_changes.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      orderId: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM(
          'deposit',
          'withdraw',
          'increase_by_admin',
          'decrease_by_admin'
        ),
        allowNull: false
      },
      balance_before: {
        type: DataTypes.STRING,
        allowNull: false
      },
      balance: {
        type: DataTypes.STRING,
        allowNull: false
      },
      balance_after: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_date: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'balance_changes'
    }
  )
  return balance_changes
}
