const { httpError, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const { phoneNumber } = req.body
  const data = { phoneNumber }
  return sequelize.models.cooperation.create(data).then((r) => {
    return res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
      .catch((e) => {
        return httpError(e, res)
      })
  })
}

module.exports = { create }
