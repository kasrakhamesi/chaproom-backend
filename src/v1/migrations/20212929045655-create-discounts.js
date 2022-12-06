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
        phoneNumber: {
          type: Sequelize.STRING,
          unique: {
            args: true,
            msg: 'This phoneNumber is already registered.'
          },
          validate: {
            is: /^(\+98|0098|98|0)?9\d{9}$/
          },
          allowNull: true
        },
        type: {
          type: Sequelize.ENUM(
            'fixed',
            'percentage',
            'page',
            'pageBlackAndWhite',
            'pageNormalColor',
            'pageFullColor'
          ),
          allowNull: false
        },
        value: {
          type: Sequelize.FLOAT,
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
        pageLimit: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true
        },
        usageLimit: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: null,
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
        },
        deletedAt: {
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
