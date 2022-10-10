const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { authentications } = require('../../services')

const login = (req, res) => {
  const { username, password } = req.body
  return sequelize.models.admins
    .findOne({
      where: {
        username,
        password
      }
    })
    .then((r) => {
      if (!r) return httpError(errorTypes.INVALID_USERNAME_PASSWORD, res)
      return authentications.sms
        .send(r?.id, r?.phone, true, false)
        .then((r) => {
          return r
        })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const loginConfirm = (req, res) => {}

module.exports = { login, loginConfirm }
