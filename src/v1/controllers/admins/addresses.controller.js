const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const addresses = new restful(sequelize.models.addresses)

const findAll = async (req, res) => {
  try {
    const { userId } = req.params
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.addresses
    )

    const newWhere = { ...where, userId }

    const user = await sequelize.models.users.findOne({
      attributes: ['id', 'name', 'phoneNumber'],
      where: {
        id: userId
      }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const r = await addresses.Get({
      where: newWhere,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    res.status(r?.statusCode).send({
      statusCode: 200,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        user,
        addresses: r?.data?.addresses
      },
      error: null
    })
  } catch (e) {
    httpError(e, res)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params
    const r = await addresses.Get({
      include: {
        model: sequelize.models.users,
        attributes: ['id', 'name', 'phoneNumber']
      },
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
      label,
      recipientName,
      recipientPhoneNumber,
      recipientPostalCode,
      recipientDeliveryProvince,
      recipientDeliveryCity,
      recipientDeliveryAddress
    } = req.body

    const data = {
      label,
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
