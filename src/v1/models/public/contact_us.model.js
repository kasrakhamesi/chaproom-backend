'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class contact_us extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contact_us.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      checked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      result: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'contact_us'
    }
  )
  return contact_us
}
