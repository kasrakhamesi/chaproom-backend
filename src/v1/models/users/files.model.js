'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      files.belongsToMany(models.folders, {
        through: 'folder_files'
      })
    }
  }
  files.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      uniqueName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      countOfPages: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      sequelize,
      //paranoid: true,
      modelName: 'files'
    }
  )
  return files
}
