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
        first_name: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        last_name: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        father_name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        national_code: {
          type: Sequelize.STRING(15),
          allowNull: false
        },
        birthday_timestamp: {
          type: Sequelize.STRING,
          allowNull: false
        },
        country: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        province: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        city: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        residence_address: {
          type: Sequelize.STRING,
          allowNull: false
        },
        postal_code: {
          type: Sequelize.STRING,
          allowNull: false
        },
        talan_address: {
          type: Sequelize.STRING,
          allowNull: false
        },
        referral_code: {
          type: Sequelize.STRING(12),
          allowNull: false
        },
        referralUserId: {
          type: Sequelize.BIGINT,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        userGroupId: {
          type: Sequelize.INTEGER,
          references: { model: 'users_groups', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
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
          allowNull: false
        },
        home_phone: {
          type: Sequelize.STRING(15),
          unique: {
            args: true,
            msg: 'This phone is already registered.'
          },
          allowNull: true
        },
        status: {
          type: Sequelize.ENUM('pending', 'rejected', 'approved'),
          defaultValue: 'pending',
          allowNull: true
        },
        balance: {
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
