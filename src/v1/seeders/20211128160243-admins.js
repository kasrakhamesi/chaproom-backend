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
        password: 'kasra',
        phoneNumber: '09385667274'
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
    await queryInterface.bulkDelete('admins', {
      roleId: 1,
      name: 'کسری',
      password: 'kasra',
      phoneNumber: '09385667274'
    })
  }
}
