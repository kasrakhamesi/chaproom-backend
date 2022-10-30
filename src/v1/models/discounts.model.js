'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class discounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      discounts.belongsTo(models.users)
    }
  }
  discounts.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('fixed', 'percentage', 'countOfPages'),
        allowNull: false
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      usageLimit: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: true
      },
      pageLimit: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      timesUsed: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: true
      },
      userMarketing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      totalSale: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: true
      },
      benefit: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: true
      },
      expireAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'discounts'
    }
  )
  return discounts
}
