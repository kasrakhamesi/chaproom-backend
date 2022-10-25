'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  addresses.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false
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
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'addresses'
    }
  )
  return addresses
}
