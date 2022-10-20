'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class admins_role_perms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admins_role_perms.init(
    {
      roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      permId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'admins_role_perms'
    }
  )
  return admins_role_perms
}
