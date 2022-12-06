'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class print_tariffs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  print_tariffs.init(
    {
      a3: {
        type: DataTypes.JSON,
        allowNull: false
      },
      a4: {
        type: DataTypes.JSON,
        allowNull: false
      },
      a5: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'print_tariffs'
    }
  )
  return print_tariffs
}
