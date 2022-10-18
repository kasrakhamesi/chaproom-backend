'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsTo(models.users, {
        as: 'referral',
        foreignKey: 'referralUserId'
      })
    }
  }
  users.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'This phone is already registered.'
        },
        validate: {
          is: /^(\+98|0098|98|0)?9\d{9}$/
        },
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      marketingCommission: {
        type: DataTypes.FLOAT,
        defaultValue: 10,
        allowNull: false
      },
      referralUserId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      marketingBalance: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      balance: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'users'
    }
  )
  return users
}
