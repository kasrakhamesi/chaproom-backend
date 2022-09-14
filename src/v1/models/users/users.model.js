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
      users.belongsTo(models.users_groups, {
        as: 'user_group',
        foreignKey: 'userGroupId'
      })
      users.belongsTo(models.users, {
        as: 'referral',
        foreignKey: 'referralUserId'
      })
    }
  }
  users.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      father_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      national_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      birthday_timestamp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      residence_address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      talan_address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      referral_code: {
        type: DataTypes.STRING(12),
        allowNull: false
      },
      referralUserId: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      userGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      phone: {
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
      home_phone: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'This phone is already registered.'
        },
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'rejected', 'approved'),
        defaultValue: 'pending',
        allowNull: true
      },
      balance: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'users'
    }
  )
  return users
}
