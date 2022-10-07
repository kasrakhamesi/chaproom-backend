'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class withdrawals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  withdrawals.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      iban: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'rejected',
          'approved',
          'pending_confirmation'
        ),
        defaultValue: 'pending',
        allowNull: false
      },
      trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true
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
      modelName: 'withdrawals'
    }
  )
  return withdrawals
}
