'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('blog_scores', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        adminId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'admins', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        category: {
          type: Sequelize.STRING,
          allowNull: true
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
        slugLink: {
          type: Sequelize.STRING,
          allowNull: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true
        },
        body: {
          type: Sequelize.TEXT('long'),
          allowNull: true
        },
        images: {
          type: Sequelize.JSON,
          allowNull: true
        },
        body: {
          type: Sequelize.TEXT('medium'),
          allowNull: true
        },
        thumb_alt: {
          type: Sequelize.STRING,
          allowNull: true
        },
        viewCount: {
          type: Sequelize.INTEGER.UNSIGNED,
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
        queryInterface.addIndex('blog_scores', ['slug'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blog_scores')
  }
}
