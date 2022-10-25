const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const bcrypt = require('bcrypt')

const update = (req, res) => {
  const { name, password } = req.body
  const userId = req?.user[0]?.id
  const data = {
    name,
    password
  }
  return sequelize.models.users
    .findOne({
      where: {
        id: userId
      }
    })
    .then((r) => {
      if (!r) return httpError(errorTypes.INVALID_PASSWORD, res)
      return r.update(data).then(() => {
        return res
          .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
          .send(messageTypes.SUCCESSFUL_UPDATE)
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findOne = (req, res) => {
  const userId = req?.user[0]?.id
  return sequelize.models.users
    .findOne({
      where: {
        id: userId
      },
      attributes: {
        exclude: ['password']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: {
          ...r.dataValues,
          walletBalance: r?.balance - r?.marketingBalance,
          avatar: null
        },
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findOne, update }
