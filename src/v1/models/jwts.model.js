'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class jwts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jwts.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      accessToken: {
        allowNull: false,
        type: DataTypes.STRING
      },
      expireAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'jwts'
    }
  )
  return jwts
}
