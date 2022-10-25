const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError } = require('../../configs')
const orders = new restful(sequelize.models.orders)

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.orders
    )

    const r = await orders.Get({
      attributes: ['id', 'createdAt', 'amount', 'status', 'notFinishingReason'],
      where,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params
    const r = await orders.Get({
      where: {
        id
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { status, sendMethod, trackingNumber, notFinishingReason } = req.body

    const data = {
      status,
      trackingNumber,
      notFinishingReason,
      sendMethod
    }

    const r = await addresses.Put({ body: data, req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = { findAll, findOne, update }
