'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class affiliates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  affiliates.init(
    {
      phone: {
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
      modelName: 'affiliates'
    }
  )
  return affiliates
}
