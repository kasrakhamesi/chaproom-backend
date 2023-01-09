const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError } = require('../../configs')
const contactUs = new restful(sequelize.models.contact_us)

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.contact_us
    )

    const r = await contactUs.Get({
      where,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      },
      attributes: {
        exclude: ['result']
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
    const { checked } = req.body

    const data = {
      checked
    }
    const r = await contactUs.Put({ body: data, where: { id } })
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAll, update }
