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
        phone: {
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
        marketingCommission: {
          type: Sequelize.FLOAT,
          defaultValue: 10,
          allowNull: false
        },
        referralUserId: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true
        },
        marketingBalance: {
          type: Sequelize.STRING,
          defaultValue: 0,
          allowNull: false
        },
        access_token: {
          type: Sequelize.STRING,
          allowNull: true
        },
        balance: {
          type: Sequelize.STRING,
          defaultValue: 0,
          allowNull: false
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: true
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
        queryInterface.addIndex('users', ['phone'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
