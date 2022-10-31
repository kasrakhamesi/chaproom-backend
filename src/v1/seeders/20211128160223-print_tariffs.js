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
      blackAndWhite: {
        singleSided: 480,
        doubleSided: 620,
        singleSidedGlossy: 0,
        doubleSidedGlossy: 0,
        breakpoints: [
          {
            at: 501,
            singleSided: 460,
            doubleSided: 580,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          },
          {
            at: 1001,
            singleSided: 430,
            doubleSided: 560,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          }
        ]
      },
      normalColor: {
        singleSided: 480,
        doubleSided: 620,
        singleSidedGlossy: 0,
        doubleSidedGlossy: 0,
        breakpoints: [
          {
            at: 501,
            singleSided: 460,
            doubleSided: 580,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          },
          {
            at: 1001,
            singleSided: 430,
            doubleSided: 560,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          }
        ]
      },
      fullColor: {
        singleSided: 480,
        doubleSided: 620,
        singleSidedGlossy: 0,
        doubleSidedGlossy: 0,
        breakpoints: [
          {
            at: 501,
            singleSided: 460,
            doubleSided: 580,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          },
          {
            at: 1001,
            singleSided: 430,
            doubleSided: 560,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          }
        ]
      }
    })

    await queryInterface.bulkInsert('print_tariffs', [
      { a3: data, a4: data, a5: data }
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
