const { httpError, errorTypes } = require('../../configs')
const { authorize } = require('../../middlewares')
const { sequelize } = require('../../models')
const { authentications } = require('../../services')

const login = (req, res) => {
  const { phoneNumber, password } = req.body
  return sequelize.models.admins
    .findOne({
      where: {
        phoneNumber,
        password
      },
      attributes: {
        exclude: ['password']
      }
    })
    .then((r) => {
      if (!r) httpError(errorTypes.INVALID_PHONE_PASSWORD, res)
      const accessToken = authorize.generateAdminJwt(r?.id, r?.phoneNumber)
      return res.status(200).send({
        statusCode: 200,
        data: {
          ...r?.dataValues,
          avatar: null,
          token: { access: accessToken }
        },
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const loginConfirm = (req, res) => {}

module.exports = { login, loginConfirm }
