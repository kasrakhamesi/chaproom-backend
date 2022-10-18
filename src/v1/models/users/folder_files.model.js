'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class folder_files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  folder_files.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      folderId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      fileId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'folder_files'
    }
  )
  return folder_files
}
