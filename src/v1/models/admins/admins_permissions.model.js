'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class admins_permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admins_permissions.init(
    {
      permission: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'admins_permissions'
    }
  )
  return admins_permissions
}
