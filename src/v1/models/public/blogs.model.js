'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      blogs.belongsToMany(models.categories, {
        through: 'blog_categories'
      })
      blogs.belongsTo(models.admins)
    }
  }
  blogs.init(
    {
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pageTitle: {
        type: DataTypes.STRING,
        allowNull: true
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      keywords: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      body: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      },
      thumbnailUrl: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      thumbnailAlt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      countOfViews: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: true
      },
      display: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'blogs'
    }
  )
  return blogs
}
