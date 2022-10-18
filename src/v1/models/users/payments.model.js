'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payments.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      amount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      authority: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      refId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verifiedStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
      fullResponse: {
        type: DataTypes.JSON,
        allowNull: true
      },
      verifiedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'payments'
    }
  )
  return payments
}
