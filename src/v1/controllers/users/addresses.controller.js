const { httpError } = require('../../configs')
const { restful, filters } = require('../../libs')
const { sequelize } = require('../../models')
const addresses = new restful(sequelize.models.addresses)

const create = (req, res) => {
  const {
    recipientName,
    recipientPhoneNumber,
    recipientPostalCode,
    recipientDeliveryProvince,
    recipientDeliveryCity,
    recipientDeliveryAddress
  } = req.body

  const userId = req?.user[0]?.id

  const data = {
    recipientName,
    recipientPhoneNumber,
    recipientPostalCode,
    recipientDeliveryProvince,
    recipientDeliveryCity,
    recipientDeliveryAddress,
    userId
  }

  return sequelize.models.addresses
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

const update = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id

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

  return sequelize.models.addresses
    .findOne({
      where: {
        userId,
        id
      }
    })
    .then((r) => {
      return r.update(data).then(() => {
        return res.status(200).send({
          statusCode: 200,
          data: {
            message: 'بروز رسانی با موفقعیت انجام شد'
          },
          error: null
        })
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.addresses
    )
    const userId = req?.user[0]?.id
    const newWhere = { ...where, userId }
    const r = await addresses.Get({
      order,
      where: newWhere,
      attributes: {
        exclude: ['userId']
      },
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    return res.status(r.statusCode).send(r)
  } catch (e) {
    return httpError(e)
  }
}

const findOne = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  addresses
    .Get({
      where: {
        id,
        userId
      },
      attributes: {
        exclude: ['userId']
      },
      findOne: true
    })
    .then((r) => {
      return res.status(r.statusCode).send(r)
    })
}

const softDelete = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.addresses
    .destroy({
      where: {
        id,
        userId
      }
    })
    .then(() => {
      return res.status(200).send({
        statusCode: 200,
        data: {
          message: 'با موفقعیت پاک شد'
        },
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { create, update, findAll, findOne, softDelete }
