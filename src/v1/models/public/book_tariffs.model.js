'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class book_tariffs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  book_tariffs.init(
    {
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      checked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'book_tariffs'
    }
  )
  return book_tariffs
}
