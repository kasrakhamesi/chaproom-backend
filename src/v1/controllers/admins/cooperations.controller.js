const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError } = require('../../configs')
const cooperations = new restful(sequelize.models.cooperations)

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.cooperations
    )

    const r = await cooperations.Get({
      where,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { description, status } = req.body

    const data = {
      description,
      status
    }
    const r = await cooperations.Put({ body: data, where: { id } })
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAll, update }
