const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const transactions = new restful(sequelize.models.transactions)

const findAll = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const { page, pageSize } = req.query
    const [where] = await filters.filter(
      req.query,
      sequelize.models.transactions
    )

    const newWhere = { ...where, userId }

    const r = await transactions.Get({
      where: newWhere,
      order: [['id', 'desc']],
      attributes: {
        exclude: [
          'userId',
          'withdrawalId',
          'adminId',
          'paymentId',
          'balance',
          'balanceAfter'
        ]
      },
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const findOne = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.transactions
    .findOne({
      where: {
        id,
        userId
      },
      attributes: {
        exclude: [
          'userId',
          'withdrawalId',
          'adminId',
          'paymentId',
          'balance',
          'balanceAfter'
        ]
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
