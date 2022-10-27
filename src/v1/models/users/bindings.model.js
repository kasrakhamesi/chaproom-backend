'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class bindings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bindings.init(
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('spring_normal', 'spring_papco', 'stapler'),
        allowNull: true
      },
      method: {
        type: DataTypes.ENUM(
          'each_file_separated',
          'all_files_together',
          'number_of_file'
        ),
        allowNull: true
      },
      numberOfFiles: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      coverColor: {
        type: DataTypes.ENUM('colorful', 'black_and_white'),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'bindings'
    }
  )
  return bindings
}
