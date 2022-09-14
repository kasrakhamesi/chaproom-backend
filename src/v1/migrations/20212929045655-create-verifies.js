'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('verifies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: { model: 'admins', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true
      },
      userId: {
        type: Sequelize.BIGINT,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        unique: {
          args: true,
          msg: 'This email is already registered.'
        },
        allowNull: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'invalid email'
          }
        }
      },
      phone: {
        type: Sequelize.STRING(11),
        unique: {
          args: true,
          msg: 'This phone is already registered.'
        },
        validate: {
          is: /^(\+98|0098|98|0)?9\d{9}$/
        },
        allowNull: true
      },
      code: {
        type: Sequelize.INTEGER(6),
        allowNull: false
      },
      used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      expire: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_token_used: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      user_token_expire: {
        type: Sequelize.STRING,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('verifies')
  }
}
