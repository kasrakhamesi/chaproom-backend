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
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      side: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false
      },
      countOfPages: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      uploadedPages: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      binding: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      numberOfCopies: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      shipmentPrice: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telegramUploadFile: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      whatsupUploadFile: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      payment: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      discountId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
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
      cancelReason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      compeleteAt: {
        allowNull: true,
        type: DataTypes.DATE
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
