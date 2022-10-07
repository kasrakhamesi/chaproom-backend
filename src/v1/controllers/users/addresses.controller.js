const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

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

const findAll = (req, res) => {
  const userId = req?.user[0]?.id
  return sequelize.models.addresses
    .findAll({
      where: {
        userId
      },
      attributes: {
        exclude: ['userId']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findOne = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.addresses
    .findOne({
      where: {
        userId,
        id
      },
      attributes: {
        exclude: ['userId']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
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
