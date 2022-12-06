'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable(
        'referrals',
        {
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
          referralUserId: {
            type: Sequelize.BIGINT.UNSIGNED,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: true
          },
          commission: {
            type: Sequelize.FLOAT,
            defaultValue: 10,
            allowNull: false
          },
          slug: {
            type: Sequelize.STRING,
            allowNull: false
          },
          sellCount: {
            type: Sequelize.INTEGER.UNSIGNED,
            defaultValue: 0,
            allowNull: false
          },
          viewCount: {
            type: Sequelize.BIGINT.UNSIGNED,
            defaultValue: 0,
            allowNull: false
          },
          totalSale: {
            type: Sequelize.BIGINT.UNSIGNED,
            defaultValue: 0,
            allowNull: false
          },
          benefit: {
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
          }
        },
        {
          freezeTableName: true,
          tableName: 'referrals'
        }
      )
      .then(() =>
        queryInterface.addIndex('referrals', ['userId'], {
          unique: true
        })
      )
      .then(() =>
        queryInterface.addIndex('referrals', ['slug'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('referrals')
  }
}
