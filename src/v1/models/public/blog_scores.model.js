'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class blog_scores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blog_scores.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      blogId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      score: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'blog_scores'
    }
  )
  return blog_scores
}
