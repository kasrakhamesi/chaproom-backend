'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('payments', {
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
          allowNull: false
        },
        amount: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false
        },
        authority: {
          type: Sequelize.STRING,
          allowNull: false
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true
        },
        refId: {
          type: Sequelize.STRING,
          allowNull: true
        },
        verifiedStatus: {
          type: Sequelize.STRING,
          allowNull: true
        },
        fullResponse: {
          type: Sequelize.JSON,
          allowNull: true
        },
        verifiedAt: {
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
        queryInterface.addIndex('payments', ['authority'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments')
  }
}
