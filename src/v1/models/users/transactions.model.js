'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class transcations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transcations.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      uploadedFileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileUrl: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      pageCount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'transcations'
    }
  )
  return transcations
}
