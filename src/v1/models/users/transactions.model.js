'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class transcations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transcations.belongsTo(models.users)
      transcations.belongsTo(models.admins)
    }
  }
  transcations.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      orderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      paymentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      withdrawalId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM(
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
        type: DataTypes.ENUM('successful', 'pending', 'unsuccessful'),
        allowNull: false
      },
      change: {
        type: DataTypes.ENUM('increase', 'decrease'),
        allowNull: false
      },
      amount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'transactions'
    }
  )
  return transcations
}
