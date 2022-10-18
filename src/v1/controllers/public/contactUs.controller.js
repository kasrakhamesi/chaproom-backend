const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const { name, message, phoneNumber } = req.body
  const data = {
    name,
    message,
    phoneNumber
  }
  return sequelize.models.contact_us.create(data).then((r) => {
    return res
      .status(201)
      .send({
        statusCode: 201,
        data: r,
        error: null
      })
      .catch((e) => {
        return httpError(e, res)
      })
  })
}

module.exports = { create }
