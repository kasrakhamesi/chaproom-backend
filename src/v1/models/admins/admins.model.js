'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      admins.belongsTo(models.admins_roles, {
        foreignKey: 'roleId',
        as: 'role'
      })
    }
  }
  admins.init(
    {
      roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'This phoneNumber is already registered.'
        },
        validate: {
          is: /^(\+98|0098|98|0)?9\d{9}$/
        },
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'admins'
    }
  )
  return admins
}
