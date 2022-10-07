const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const { iban, amount } = req.body

  const userId = req?.user[0]?.id

  const data = {
    iban,
    amount,
    userId
  }

  return sequelize.models.withdrawals
    .create(data)
    .then((r) => {
      return res.status(201).send({
        statusCode: 201,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findAll = (req, res) => {
  const userId = req?.user[0]?.id
  return sequelize.models.addresses
    .findAll({
      where: {
        userId
      },
      attributes: {
        exclude: ['userId']
      }
    })
    .then((r) => {
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

const findOne = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.withdrawals
    .findOne({
      where: {
        userId,
        id
      },
      attributes: {
        exclude: ['userId']
      }
    })
    .then((r) => {
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

module.exports = { create, findAll, findOne }
