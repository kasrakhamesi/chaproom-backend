'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('discounts', {
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
          allowNull: true
        },
        adminId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'admins', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        type: {
          type: Sequelize.ENUM('fixed', 'percentage', 'page'),
          allowNull: false
        },
        value: {
          type: Sequelize.STRING,
          allowNull: false
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true
        },
        usageLimit: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: true
        },
        timesUsed: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: true
        },
        totalSale: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: true
        },
        benefit: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: true
        },
        userMarketing: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
        expireAt: {
          allowNull: true,
          type: Sequelize.DATE
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
        queryInterface.addIndex('discounts', ['code'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('discounts')
  }
}
