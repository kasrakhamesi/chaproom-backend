'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('blogs_activities', {
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
        ip: {
          type: Sequelize.STRING,
          allowNull: false
        },
        view: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
        },
        score: {
          type: Sequelize.INTEGER.UNSIGNED,
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
      .then(() =>
        queryInterface.addIndex('blogs_activities', ['ip'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blogs_activities')
  }
}
