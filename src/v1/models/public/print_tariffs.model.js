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
      type: {
        type: DataTypes.ENUM('black_and_white', 'full_color', 'normal_color'),
        allowNull: false
      },
      size: {
        type: DataTypes.ENUM('a4', 'a5', 'a3'),
        allowNull: false
      },
      single_sided: {
        type: DataTypes.JSON,
        allowNull: false
      },
      double_sided: {
        type: DataTypes.JSON,
        allowNull: false
      },
      single_sided_glossy: {
        type: DataTypes.JSON,
        allowNull: false
      },
      double_sided_glossy: {
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
