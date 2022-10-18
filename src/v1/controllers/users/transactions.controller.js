const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')

const findAll = (req, res) => {
  const userId = req?.user[0]?.id
}

const findOne = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.transactions
    .findOne({
      where: {
        id,
        userId
      }
    })
    .then((r) => {
      if (!r) return httpError(errorTypes.MISSING_TRANSACTION, res)
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findOne, findAll }
