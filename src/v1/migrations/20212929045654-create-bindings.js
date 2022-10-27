'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bindings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('spring_normal', 'spring_papco', 'stapler'),
        allowNull: true
      },
      method: {
        type: Sequelize.ENUM(
          'each_file_separated',
          'all_files_together',
          'number_of_file'
        ),
        allowNull: true
      },
      numberOfFiles: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      coverColor: {
        type: Sequelize.ENUM('colorful', 'black_and_white'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bindings')
  }
}
