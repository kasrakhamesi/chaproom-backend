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
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
        },
        recipient_name: {
        type: DataTypes.STRING,
        allowNull: false
        },
        recipient_number: {
        type: DataTypes.STRING,
        allowNull: false
        },
        postal_code: {
        type: DataTypes.STRING,
        allowNull: false
        },
        province: {
        type: DataTypes.STRING,
        allowNull: false
        },
        city: {
        type: DataTypes.STRING,
        allowNull: false
        },
        address: {
        type: DataTypes.TEXT,
        allowNull: false
        },
    },
    {
      sequelize,
      modelName: 'addresses'
    }
  )
  return addresses
}
