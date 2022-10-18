'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class verifies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  verifies.init(
    {
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.STRING(11),
        unique: {
          args: true,
          msg: 'This phone is already registered.'
        },
        validate: {
          is: /^(\+98|0098|98|0)?9\d{9}$/
        },
        allowNull: true
      },
      code: {
        type: DataTypes.INTEGER(6),
        allowNull: false
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      passwordReset: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      expireAt: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'verifies'
    }
  )
  return verifies
}
