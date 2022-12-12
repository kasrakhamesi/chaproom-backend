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
        doubleSided: 520,
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
        singleSided: 580,
        doubleSided: 620,
        singleSidedGlossy: 0,
        doubleSidedGlossy: 0,
        breakpoints: [
          {
            at: 501,
            singleSided: 760,
            doubleSided: 880,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          },
          {
            at: 1001,
            singleSided: 930,
            doubleSided: 1060,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          }
        ]
      },
      fullColor: {
        singleSided: 1180,
        doubleSided: 1220,
        singleSidedGlossy: 0,
        doubleSidedGlossy: 0,
        breakpoints: [
          {
            at: 501,
            singleSided: 1360,
            doubleSided: 1480,
            singleSidedGlossy: 0,
            doubleSidedGlossy: 0
          },
          {
            at: 1001,
            singleSided: 1530,
            doubleSided: 1660,
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
