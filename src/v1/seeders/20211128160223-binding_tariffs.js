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
    await queryInterface.bulkInsert('binding_tariffs', [
      {
        a4_springNormal: 560,
        a5_springNormal: 700,
        a3_springNormal: 400,
        a5_springPapco: 1000,
        a4_springPapco: 900,
        a3_springPapco: 1200,
        stapler: 400
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
