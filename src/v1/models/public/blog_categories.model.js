'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class blog_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blog_categories.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      //paranoid: true,
      modelName: 'blog_categories'
    }
  )
  return blog_categories
}
