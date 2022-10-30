'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cooperations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cooperations.init(
    {
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'cooperations'
    }
  )
  return cooperations
}
