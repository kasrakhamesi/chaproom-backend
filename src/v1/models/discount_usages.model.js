'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class discount_usages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  discount_usages.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      orderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      discountId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'discount_usages'
    }
  )
  return discount_usages
}
