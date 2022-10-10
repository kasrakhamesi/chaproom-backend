const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const { phone } = req.body
  const data = { phone }
  return sequelize.models.affiliates.create(data).then((r) => {
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
