'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class binding_tariffs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  binding_tariffs.init(
    {
      a4_springNormal: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      a5_springNormal: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      a3_springNormal: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      a5_springPapco: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      a4_springPapco: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      a3_springPapco: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      stapler: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'binding_tariffs'
    }
  )
  return binding_tariffs
}
