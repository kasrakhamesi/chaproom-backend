const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const {} = req.body
  const data = {
    userId
  }
  const userId = req?.user[0]?.id
  return sequelize.models.folders
    .create(data)
    .then((r) => {
      return res.status(201).send({
        statusCode: 201,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { create }
