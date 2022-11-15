'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class blogs_activities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blogs_activities.init(
    {
      blogId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: { model: 'blogs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false
      },
      view: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'blogs_activities'
    }
  )
  return blogs_activities
}
