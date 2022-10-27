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
      folders.belongsTo(models.bindings)
    }
  }
  folders.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      bindingId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
      },
      color: {
        type: DataTypes.ENUM('black_and_white', 'full_color', 'normal_color'),
        allowNull: false
      },
      side: {
        type: DataTypes.ENUM(
          'single_sided',
          'double_sided',
          'single_sided_glossy',
          'double_sided_glossy'
        ),
        allowNull: false
      },
      size: {
        type: DataTypes.ENUM('a4', 'a5', 'a3'),
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
