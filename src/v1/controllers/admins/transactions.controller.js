const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
const transactions = new restful(sequelize.models.transactions)

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.transactions
    )

    const r = await transactions.Get({
      include: [
        {
          model: sequelize.models.users,
          attributes: ['name', 'phoneNumber', 'id']
        },
        {
          model: sequelize.models.admins,
          attributes: ['name', 'id']
        }
      ],
      attributes: {
        exclude: [
          'userId',
          'withdrawalId',
          'adminId',
          'paymentId',
          'balance',
          'balanceAfter',
          'type'
        ]
      },
      where,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) res.status(r?.statusCode).send(r)

    res.status(r?.statusCode).send({
      statusCode: r?.statusCode,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        transactions: r?.data?.transactions.map((item) => {
          return {
            id: item.id,
            orderId: item.orderId,
            type: 'debtor',
            status: item.status,
            amount: item.amount,
            description: item.description,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            user: item.user,
            admin: item.admin
          }
        })
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
    const r = await transactions.Get({
      include: [
        {
          model: sequelize.models.users,
          attributes: ['name', 'phoneNumber', 'id']
        },
        {
          model: sequelize.models.admins,
          attributes: ['name', 'id']
        }
      ],
      attributes: {
        exclude: [
          'userId',
          'withdrawalId',
          'adminId',
          'paymentId',
          'balance',
          'balanceAfter',
          'type'
        ]
      },
      where: {
        id
      }
    })

    if (r?.statusCode !== 200) res.status(r?.statusCode).send(r)

    res.status(r?.statusCode).send({
      statusCode: r?.statusCode,
      data: {
        id: r?.data?.id,
        orderId: r?.data?.orderId,
        type: 'debtor',
        status: r?.data?.status,
        amount: r?.data?.amount,
        description: r?.data?.description,
        createdAt: r?.data?.createdAt,
        updatedAt: r?.data?.updatedAt,
        user: r?.data?.user,
        admin: r?.data?.admin
      },
      error: null
    })
  } catch (e) {
    httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params

    const transaction = await sequelize.models.transactions.findOne({
      where: { id, adminId: { [Op.not]: null } }
    })

    if (!transaction)
      return httpError(errorTypes.TRANSACTION_NOT_CREATED_BY_ADMIN, res)
  } catch (e) {
    httpError(e, res)
  }
}

const softDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await transactions.Delete({ req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = { findAll, findOne, update, softDelete }
