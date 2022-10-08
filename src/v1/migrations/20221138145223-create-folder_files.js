'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('folder_files', {
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
        folderId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'folders', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        fileId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'files', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        createdAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addIndex(
          'folder_files',
          ['userId', 'folderId', 'fileId'],
          {
            unique: true
          }
        )
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('folder_files')
  }
}
