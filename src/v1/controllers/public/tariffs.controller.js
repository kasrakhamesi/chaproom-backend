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

    res.status(200).send({
      statusCode: 200,
      data: {
        binding: promises[0],
        print: _.isEmpty(promises[1])
          ? null
          : promises[1].map((item) => {
              return {
                id: item.id,
                type: item.type,
                size: item.size,
                single_sided: JSON.parse(item.single_sided),
                double_sided: JSON.parse(item.double_sided),
                single_sided_glossy: JSON.parse(item.single_sided_glossy),
                double_sided_glossy: JSON.parse(item.double_sided_glossy)
              }
            }),
        book: promises[2]
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAll }
