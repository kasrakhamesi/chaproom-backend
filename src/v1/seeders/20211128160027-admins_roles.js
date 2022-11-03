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
    await queryInterface.bulkInsert('admins_roles', [
      {
        name: 'superAdmin'
      },
      {
        name: 'admin'
      },
      {
        name: 'agent'
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
    await queryInterface.bulkDelete('admins_roles', {
      name: 'superAdmin'
    })
    await queryInterface.bulkDelete('admins_roles', {
      name: 'admin'
    })
    await queryInterface.bulkDelete('admins_roles', {
      name: 'agent'
    })
  }
}
