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
    await queryInterface.bulkInsert('admins', [
      {
        roleId: 1,
        name: 'کسری',
        password: 'superadmin',
        phoneNumber: '09385667274'
      },
      {
        roleId: 2,
        name: 'کسری',
        password: 'adminadmin',
        phoneNumber: '09385667272'
      },
      {
        roleId: 3,
        name: 'کسری',
        password: 'agentagent',
        phoneNumber: '09385667270'
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
