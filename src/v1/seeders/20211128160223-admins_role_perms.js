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
    await queryInterface.bulkInsert('admins_role_perms', [
      {
        roleId: 1,
        permId: 1
      },
      {
        roleId: 2,
        permId: 2
      },
      {
        roleId: 2,
        permId: 3
      },
      {
        roleId: 2,
        permId: 4
      },
      {
        roleId: 2,
        permId: 5
      },
      {
        roleId: 2,
        permId: 6
      },

      {
        roleId: 2,
        permId: 8
      },
      {
        roleId: 2,
        permId: 9
      },
      {
        roleId: 2,
        permId: 10
      },
      {
        roleId: 3,
        permId: 2
      },
      {
        roleId: 3,
        permId: 6
      },
      {
        roleId: 3,
        permId: 10
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
