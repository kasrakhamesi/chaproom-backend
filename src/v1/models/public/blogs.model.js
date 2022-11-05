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
    }
  }
  blogs.init(
    {
      adminId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true
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
      slugLink: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      body: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true
      },
      thumb_alt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      viewCount: {
        type: DataTypes.INTEGER.UNSIGNED,
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
