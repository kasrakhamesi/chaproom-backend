const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
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
      attributes: [
        'id',
        'name',
        'phoneNumber',
        'balance',
        'marketingBalance',
        'createdAt'
      ],
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

    const totalUsersCount = await sequelize.models.users.count()

    const totalOrdersCount = await sequelize.models.orders.count({
      where: {
        status: { [Op.not]: 'payment_pending' }
      }
    })

    for (const entity of r?.data?.users) {
      const countOfOrders = await sequelize.models.orders.count({
        where: {
          userId: entity?.id,
          status: { [Op.not]: 'payment_pending' }
        }
      })

      const userTransactions = await sequelize.models.transactions.findAll({
        where: {
          userId: entity?.id,
          status: 'successful',
          adminId: null
        }
      })

      const lastOrder = await sequelize.models.orders.findAll({
        limit: 1,
        where: {
          userId: entity?.id,
          status: { [Op.not]: 'payment_pending' }
        },
        order: [['createdAt', 'DESC']]
      })

      const firstOrder = await sequelize.models.orders.findAll({
        limit: 1,
        where: {
          userId: entity?.id,
          status: { [Op.not]: 'payment_pending' }
        },
        order: [['createdAt', 'DESC']]
      })

      let incoming = 0

      for (const transaction of userTransactions) {
        if (transaction?.change === 'increase')
          incoming += parseInt(transaction?.amount)
      }

      data.push({
        ...entity,
        countOfOrders,
        totalPaidAmount: incoming,
        firstOrderAt: firstOrder[0]?.createdAt || null,
        lastOrderAt: lastOrder[0]?.createdAt || null
      })
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
        totalUsersCount,
        totalOrdersCount,
        totalDebtor: 5000,
        totalCreditor: 6000,
        customersReport: data
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAll }
