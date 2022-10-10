const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const bcrypt = require('bcrypt')
const { uniqueGenerates } = require('../../libs')

const dashboard = (req, res) => {}

const changeProfile = (req, res) => {
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

module.exports = { dashboard, changeProfile }
