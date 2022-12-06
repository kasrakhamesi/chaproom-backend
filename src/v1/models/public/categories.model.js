'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      categories.belongsToMany(models.blogs, {
        through: 'blog_categories'
      })
    }
  }
  categories.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      //paranoid: true,
      modelName: 'categories'
    }
  )
  return categories
}
