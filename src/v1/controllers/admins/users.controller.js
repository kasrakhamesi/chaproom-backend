const { sequelize } = require('../../models')
const { restful } = require('../../libs')
const { httpError } = require('../../configs')
const users = new restful(sequelize.models.users)

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.users
    )

    const r = await users.Get({
      where,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    const ordersCondition = []

    const orders = await sequelize.models.orders.findAll({
      where: {
        userId
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
    const r = await users.Get({
      where: {
        id
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const create = async (req, res) => {
  try {
    const { name, phone, password, balance } = req.body
    const data = {
      name,
      phone,
      password,
      balance
    }
    const r = await users.Post({ body: data, req })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, password, balance } = req.body
    const data = {
      name,
      phone,
      password,
      balance
    }
    const r = await users.Put({ body: data, req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const softDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await users.Delete({ req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = { findAll, findOne, create, update, softDelete }
