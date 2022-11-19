const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { Op } = require('sequelize')
const _ = require('lodash')
const transactions = new restful(sequelize.models.transactions)

const findAll = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.transactions
    )

    const newWhere = {
      ...where,
      userId,
      status: { [Op.not]: 'pending' }
    }

    const r = await transactions.Get({
      where: newWhere,
      order: [['id', 'desc']],
      attributes: {
        exclude: [
          'userId',
          'withdrawalId',
          'adminId',
          'paymentId',
          'balance',
          'balanceAfter'
        ]
      },
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) res.status(r?.statusCode).send(r)

    res.status(200).send({
      statusCode: 200,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        transactions: r?.data?.transactions.map((item) => {
          console.log(item.orderId, item.change)
          if (item.orderId !== null && item.change === 'increase') {
            return {
              id: item.id,
              orderId: null,
              type: item.type,
              status: item.status,
              change: item.change,
              amount: item.amount,
              description: item.description,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              deletedAt: item.deletedAt || null
            }
          }
          return {
            id: item.id,
            orderId: item?.orderId || null,
            type: item.type,
            status: item.status,
            change: item.change,
            amount: item.amount,
            description: item.description,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            deletedAt: item.deletedAt || null
          }
        })
      },
      error: null
    })
  } catch (e) {
    httpError(e, res)
  }
}

const findOne = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.transactions
    .findOne({
      where: {
        id,
        userId
      },
      attributes: {
        exclude: [
          'userId',
          'withdrawalId',
          'adminId',
          'paymentId',
          'balance',
          'balanceAfter'
        ]
      }
    })
    .then((r) => {
      if (!r) return httpError(errorTypes.MISSING_TRANSACTION, res)
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

module.exports = { findOne, findAll }
