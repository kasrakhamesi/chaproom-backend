'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('blogs', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED
        },
        adminId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'admins', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        pageTitle: {
          type: Sequelize.STRING,
          allowNull: true
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: false
        },
        keywords: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        metaDescription: {
          type: Sequelize.STRING,
          allowNull: true
        },
        body: {
          type: Sequelize.TEXT('long'),
          allowNull: true
        },
        thumbnailUrl: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        thumbnailAlt: {
          type: Sequelize.STRING,
          allowNull: true
        },
        countOfViews: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: true
        },
        display: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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
        queryInterface.addIndex('blogs', ['slug'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blogs')
  }
}
