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
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      orderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      balanceBefore: {
        type: DataTypes.STRING,
        allowNull: false
      },
      balance: {
        type: DataTypes.STRING,
        allowNull: false
      },
      balanceAfter: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false
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
