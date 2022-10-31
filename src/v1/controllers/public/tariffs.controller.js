const { httpError } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')

const getBindingPriceses = () => {
  return sequelize.models.binding_tariffs
    .findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt']
      }
    })
    .then((r) => {
      return r
    })
}

const getPrintPriceses = () => {
  return sequelize.models.print_tariffs
    .findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    .then((r) => {
      return r
    })
}

const getBookPriceses = () => {
  return sequelize.models.book_tariffs
    .findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    .then((r) => {
      return r
    })
}

const findAll = async (req, res) => {
  try {
    const promises = await Promise.all([
      getBindingPriceses(),
      getPrintPriceses(),
      getBookPriceses()
    ])

    const binding = _.isEmpty(promises[0])
      ? null
      : {
          springNormal: {
            a4: promises[0].a4_springNormal,
            a3: promises[0].a3_springNormal,
            a5: promises[0].a5_springNormal
          },
          springPapco: {
            a4: promises[0].a4_springPapco,
            a3: promises[0].a3_springPapco,
            a5: promises[0].a5_springPapco
          },
          stapler: promises[0].stapler
        }

    const print = _.isEmpty(promises[1])
      ? null
      : promises[1].map((item) => {
          return {
            a3: JSON.parse(item.a3),
            a4: JSON.parse(item.a4),
            a5: JSON.parse(item.a5)
          }
        })

    res.status(200).send({
      statusCode: 200,
      data: {
        binding,
        print,
        book: promises[2]
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAll }
