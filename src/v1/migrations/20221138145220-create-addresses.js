'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('addresses', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED
        },
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        recipient_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        recipient_number: {
          type: Sequelize.STRING,
          allowNull: false
        },
        postal_code: {
          type: Sequelize.STRING,
          allowNull: false
        },
        province: {
          type: Sequelize.STRING,
          allowNull: false
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: false
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
      .then(() => queryInterface.addIndex('addresses', ['id'], { unique: true }))
      .then(() =>
        queryInterface.addIndex('addresses', ['payment_token'], { unique: true })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addresses')
  }
}
