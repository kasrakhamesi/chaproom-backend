const { httpError, errorTypes } = require('../../configs')
const { authorize } = require('../../middlewares')
const { sequelize } = require('../../models')
const bcrypt = require('bcrypt')

const register = (req, res) => {
  return sequelize.models.users
    .create(req.body)
    .then((r) => {
      const accessToken = authorize.generateUserJwt(r?.id, r?.phone)
      return sequelize.models.users
        .update(
          {
            accessToken
          },
          {
            where: {
              id: r?.id
            }
          }
        )
        .then(() => {
          return sequelize.models.users
            .findOne({
              where: {
                id: r?.id
              },
              attributes: {
                exclude: ['password', 'referralUserId', 'active']
              }
            })
            .then((r) => {
              return res.status(201).send({
                statusCode: 201,
                data: r,
                error: null
              })
            })
        })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const registerConfirm = (req, res) => {}

const login = (req, res) => {
  const { phone, password } = req.body
  return sequelize.models.users
    .findOne({
      where: {
        phone,
        password
      },
      attributes: {
        exclude: ['password', 'referralUserId', 'active']
      }
    })
    .then((r) => {
      if (!r) httpError(errorTypes.INVALID_PHONE_PASSWORD, res)
      const accessToken = authorize.generateUserJwt(r?.id, r?.phone)
      return sequelize.models.users
        .update(
          {
            accessToken
          },
          {
            where: {
              id: r?.id,
              phone: r?.phone
            },
            attributes: {
              exclude: ['accessToken']
            }
          }
        )
        .then(() => {
          return res.status(200).send({
            statusCode: 200,
            data: { ...r?.dataValues, accessToken },
            error: null
          })
        })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const passwordReset = (req, res) => {}

const passwordResetConfirm = (req, res) => {}

module.exports = { register, login, registerConfirm, passwordResetConfirm }
