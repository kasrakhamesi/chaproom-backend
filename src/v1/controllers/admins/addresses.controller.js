const { sequelize } = require('../../models')
const { restful } = require('../../libs')
const { httpError } = require('../../configs')
const addresses = new restful(sequelize.models.addresses)

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.addresses
    )
    const r = await addresses.Get({
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
    const r = await addresses.Get({
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
    const {
      recipientName,
      recipientPhoneNumber,
      recipientPostalCode,
      recipientDeliveryProvince,
      recipientDeliveryCity,
      recipientDeliveryAddress
    } = req.body

    const data = {
      recipientName,
      recipientPhoneNumber,
      recipientPostalCode,
      recipientDeliveryProvince,
      recipientDeliveryCity,
      recipientDeliveryAddress
    }

    const r = await addresses.Put({ body: data, req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const softDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await addresses.Delete({ req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = { findAll, findOne, update, softDelete }
