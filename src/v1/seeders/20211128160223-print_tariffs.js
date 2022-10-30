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

    await queryInterface.bulkInsert('print_tariffs', [
      {
        type: 'full_color',
        size: 'a4',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'black_and_white',
        size: 'a4',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'normal_color',
        size: 'a4',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'full_color',
        size: 'a5',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'black_and_white',
        size: 'a5',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'normal_color',
        size: 'a5',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'full_color',
        size: 'a3',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'black_and_white',
        size: 'a3',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
      },
      {
        type: 'normal_color',
        size: 'a3',
        single_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        single_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ]),
        double_sided_glossy: JSON.stringify([
          {
            fromPage: 0,
            price: 800
          },
          {
            fromPage: 10,
            price: 800
          }
        ])
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
