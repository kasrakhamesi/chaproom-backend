const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const bcrypt = require('bcrypt')

const dashboard = (req, res) => {}

const changeProfile = (req, res) => {
  const userId = req?.user[0]?.id
}

const changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body
  const userId = req?.user[0]?.id
  return sequelize.models.users
    .findOne({
      where: {
        password: oldPassword,
        id: userId
      }
    })
    .then((r) => {
      if (!r) return httpError(errorTypes.INVALID_PASSWORD, res)
      return r
        .update({
          password: newPassword
        })
        .then(() => {
          return res
            .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
            .send(messageTypes.SUCCESSFUL_UPDATE)
        })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const getDiscounts = (req, res) => {
  const userId = req?.user[0]?.id
  return sequelize.models.discounts
    .findAll({
      where: {
        userId
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

module.exports = { dashboard, changePassword, changeProfile, getDiscounts }
