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
      withdrawals.belongsTo(models.users, {
        as: 'user',
        foreignKey: 'userId'
      })
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
      owner: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'rejected',
          'approved',
          'confirmation_pending'
        ),
        defaultValue: 'pending',
        allowNull: false
      },
      trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      amount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'withdrawals'
    }
  )
  return withdrawals
}
