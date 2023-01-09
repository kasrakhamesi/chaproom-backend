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
    const data = JSON.stringify({
      rahli: {
        writing80Grams: {
          hotGlue: 12
        }
      },
      raqai: {
        writing80Grams: {
          hotGlue: 12
        }
      },
      vaziri: {
        writing80Grams: {
          hotGlue: 12
        }
      }
    })
    await queryInterface.bulkInsert('book_tariffs', [
      {
        tariffs: data
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
