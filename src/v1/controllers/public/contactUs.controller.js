const { httpError, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const { name, message, phoneNumber } = req.body
  const data = {
    name,
    message,
    phoneNumber
  }
  return sequelize.models.contact_us
    .create(data)
    .then(() => {
      return res
        .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
        .send(messageTypes.SUCCESSFUL_CREATED)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { create }
