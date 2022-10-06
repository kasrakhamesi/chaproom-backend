'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('admins', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED
        },
        roleId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'admins_roles', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING,
          unique: {
            args: true,
            msg: 'This username is already registered.'
          },
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
          set(value) {
            this.setDataValue('password', hash(this.username + value))
          }
        },
        lastLogin: {
          type: Sequelize.STRING,
          allowNull: true
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
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
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
        queryInterface.addIndex('admins', ['phone'], { unique: true })
      )
      .then(() =>
        queryInterface.addIndex('admins', ['username'], { unique: true })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admins')
  }
}
