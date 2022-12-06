'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class order_folders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order_folders.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      folderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      orderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      }
    },
    {
      sequelize,
      //paranoid: true,
      modelName: 'order_folders'
    }
  )
  return order_folders
}
