'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phoneNumber: {
          type: Sequelize.STRING,
          unique: {
            args: true,
            msg: 'This phone is already registered.'
          },
          validate: {
            is: /^(\+98|0098|98|0)?9\d{9}$/
          },
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        marketingBalance: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false
        },
        balance: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: true
        },
        countOfOrders: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false
        },
        incomingPayment: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false
        },
        totalDebtor: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false
        },
        totalCreditor: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false
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
        queryInterface.addIndex('users', ['phoneNumber'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
