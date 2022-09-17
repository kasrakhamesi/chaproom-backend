const { sequelize } = require('../../models')
const _ = require('lodash')

const create = (req, res) => {
  const data = _.pick(req.body, [
    'recipient_name',
    'recipient_number',
    'postal_code',
    'province',
    'city',
    'address'
  ])

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
      return res.status(400).send({
        statusCode: 400,
        data: null,
        error: {
          message: e.message,
          message_locale: 'اضافه کردن آدرس با مشکل مواجه شد'
        }
      })
    })
}

const findAll = (req, res) => {
  const { userId } = req.params
  return sequelize.models.addresses
    .findAll({
      where: {
        user_id: userId
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
      return res.status(400).send({
        statusCode: 400,
        data: null,
        error: {
          message: e.message,
          message_locale: 'پیدا کردن آدرس ها با مشکل مواجه شد'
        }
      })
    })
}

const findOne = (req, res) => {
  const { id } = req.params
  return sequelize.models.addresses
    .findAll({
      where: {
        id
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
      return res.status(400).send({
        statusCode: 400,
        data: null,
        error: {
          message: e.message,
          message_locale: 'پیدا کردن آدرس ها با مشکل مواجه شد'
        }
      })
    })
}

const softDelete = (req, res) => {
  const { id } = req.params
  let where = { id: parseInt(id) }
  if (id.startsWith('[') && id.endsWith(']')) {
    const ids = JSON.parse(id)
    where = { id: ids }
  }
  return sequelize.models.destroy
    .findAll({
      where
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return res.status(400).send({
        statusCode: 400,
        data: null,
        error: {
          message: e.message,
          message_locale: 'حذف کردن آدرس ها با مشکل مواجه شد'
        }
      })
    })
}

const softDeleteAll = (req, res) => {
  return sequelize.models.addresses
    .findAll({
      where: {}
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return res.status(400).send({
        statusCode: 400,
        data: null,
        error: {
          message: e.message,
          message_locale: 'حذف کردن آدرس ها با مشکل مواجه شد'
        }
      })
    })
}

module.exports = {
  create,
  findOne,
  findAll,
  softDelete,
  softDeleteAll
}
