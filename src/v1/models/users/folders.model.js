'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class folders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      folders.belongsToMany(models.files, {
        through: 'folder_files'
      })
      folders.belongsToMany(models.orders, {
        through: 'order_folders'
      })
    }
  }
  folders.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      side: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false
      },
      countOfPages: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      uploadedPages: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      binding: {
        type: DataTypes.TEXT('medium'),
        allowNull: true
      },
      numberOfCopies: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT('medium'),
        allowNull: true
      },
      shipmentPrice: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      countOfFiles: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      filesUrl: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      amount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      telegramUploadFile: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      whatsappUploadFile: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    {
      sequelize,
      //paranoid: true,
      modelName: 'folders'
    }
  )
  return folders
}
