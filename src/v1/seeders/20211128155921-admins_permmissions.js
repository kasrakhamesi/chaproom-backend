'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('admins_permissions', [
      {
        permission: 'GOD',
        description: 'Full Access'
      },
      {
        permission: 'orders',
        description: 'orders'
      },
      {
        permission: 'transactions',
        description: 'transactions'
      },
      {
        permission: 'discounts',
        description: 'discounts'
      },
      {
        permission: 'marketings',
        description: 'marketings'
      },
      {
        permission: 'users',
        description: 'users'
      },
      {
        permission: 'admins',
        description: 'admins'
      },
      {
        permission: 'customerReport',
        description: 'customerReport'
      },
      {
        permission: 'tariffs',
        description: 'tariffs'
      },
      {
        permission: 'blog',
        description: 'blog'
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
