'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('blog_categories', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED
        },
        blogId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'blogs', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        categoryId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'categories', key: 'id' },
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
        queryInterface.addIndex('blog_categories', ['blogId', 'categoryId'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blog_categories')
  }
}
