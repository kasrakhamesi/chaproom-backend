'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class referrals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      referrals.belongsTo(models.users, {
        as: 'referralUser',
        foreignKey: 'referralUserId'
      })
      referrals.belongsTo(models.users, {
        as: 'user',
        foreignKey: 'userId'
      })
    }
  }
  referrals.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      referralUserId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      commission: {
        type: DataTypes.FLOAT,
        defaultValue: 10,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sellCount: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      },
      viewCount: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      },
      totalSale: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      },
      benefit: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: false
      }
    },
    {
      sequelize,
      //paranoid: true,
      modelName: 'referrals'
    }
  )
  return referrals
}
