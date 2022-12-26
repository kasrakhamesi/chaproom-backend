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
        name: 'هادی توسلی',
        password:
          '$2b$12$qiOGjLyUh.vCZOy7HYLYvOnTrU6c4YxpzB1wFc6YwFQ84MFF2YcTW',
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
  }
}
