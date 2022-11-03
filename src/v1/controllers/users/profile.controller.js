const { httpError, errorTypes, messageTypes } = require('../../configs')
const { authorize } = require('../../middlewares')
const { sequelize } = require('../../models')
const bcrypt = require('bcrypt')
const { utils } = require('../../libs')

const update = (req, res) => {
  const { name, password } = req.body
  const userId = req?.user[0]?.id
  const data =
    password === '' || password === null
      ? {
          name
        }
      : {
          password,
          name
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
        const accessToken = authorize.generateUserJwt(r?.id, r?.phoneNumber)
        return res.status(messageTypes.SUCCESSFUL_UPDATE.statusCode).send({
          statusCode: messageTypes.SUCCESSFUL_UPDATE.statusCode,
          data: {
            message: messageTypes.SUCCESSFUL_UPDATE.data.message,
            token: {
              access: accessToken,
              expire: utils.timestampToIso(
                authorize.decodeJwt(accessToken, false).exp
              )
            }
          },
          error: null
        })
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
