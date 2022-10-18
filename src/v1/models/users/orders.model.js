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
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      addressId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      discountId: {
        type: DataTypes.BIGINT.UNSIGNED,
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
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      sendMethod: {
        type: DataTypes.STRING,
        defaultValue: 'پست پیشتاز',
        allowNull: true
      },
      recipientName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recipientPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recipientPostalCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recipientDeliveryProvince: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recipientDeliveryCity: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recipientDeliveryAddress: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      discountType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      discountValue: {
        type: DataTypes.STRING,
        allowNull: true
      },
      discountCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      discountAmount: {
        type: DataTypes.STRING,
        allowNull: true
      },
      trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cancelReason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      paymentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      walletPaidPrice: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      gatewayPaidPrice: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      sentAt: {
        allowNull: true,
        type: DataTypes.DATE
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
