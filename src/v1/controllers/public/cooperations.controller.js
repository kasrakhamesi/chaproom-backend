const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const { phoneNumber } = req.body
  const data = { phoneNumber }
  return sequelize.models.cooperation.create(data).then((r) => {
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
