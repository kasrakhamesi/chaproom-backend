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
      orders.belongsToMany(models.folders, {
        through: 'order_folders'
      })
      orders.belongsTo(models.users)
      orders.belongsTo(models.referrals)
      orders.belongsTo(models.discounts)
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
      referralId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      discountId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM(
          'payment_pending',
          'pending',
          'preparing',
          'canceled',
          'sent'
        ),
        allowNull: false
      },
      amount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      postageMethod: {
        type: DataTypes.STRING,
        defaultValue: 'پست پیشتاز',
        allowNull: true
      },
      postageFee: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 20000,
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
        type: DataTypes.FLOAT,
        allowNull: true
      },
      discountCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      discountAmount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      discountBenefit: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      referralBenefit: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      referralCommission: {
        type: DataTypes.FLOAT,
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
        references: { model: 'admins', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true
      },
      paymentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: { model: 'payments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true
      },
      walletPaidAmount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      gatewayPaidAmount: {
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
