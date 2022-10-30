const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError } = require('../../configs')
const users = new restful(sequelize.models.users)
const _ = require('lodash')

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.users
    )

    let r = await users.Get({
      attributes: ['id', 'name', 'balance', 'marketingBalance'],
      where,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return httpError(e, res)

    if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
      r.data.users = r?.data?.users.map((item) => {
        return {
          ...item.dataValues,
          walletBalance: item.balance - item.marketingBalance
        }
      })

      r.data.users = await Promise.all(r.data.users)
    }

    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    let data = []

    for (const entity of r?.data?.users) {
      const countOfOrders = await sequelize.models.orders.count({
        where: {
          userId: entity?.id
        }
      })
      data.push({ ...entity, countOfOrders })
    }

    data = await Promise.all(data)

    res.status(200).send({
      statusCode: 200,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        users: data
      },
      error: null
    })
  } catch (e) {
    console.log(e)
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
