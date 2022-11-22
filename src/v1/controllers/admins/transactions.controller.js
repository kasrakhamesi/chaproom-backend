const { sequelize } = require('../../models')
const { restful, filters, utils, users } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const { Op } = require('sequelize')
const transactions = new restful(sequelize.models.transactions)
const _ = require('lodash')

const findAll = async (req, res) => {
  try {
    let { startAt, endAt } = req.query
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.transactions
    )

    const newWhere = {
      ...where
    }
    if (startAt) newWhere.createdAt = { [Op.gte]: startAt }
    if (endAt) newWhere.createdAt = { [Op.lte]: endAt }

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
      where: newWhere,
      order: [['id', 'desc']],
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
            type: item.change === 'decrease' ? 'debtor' : 'creditor',
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
        type: r?.data?.change === 'decrease' ? 'debtor' : 'creditor',
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
    const adminId = req?.user[0]?.id
    const { id } = req.params
    const { userId, type, amount, description } = req.body

    const change = type === 'debtor' ? 'decrease' : 'increase'

    const user = await sequelize.models.users.findOne({
      where: { id: userId }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const transaction = await sequelize.models.transactions.findOne({
      where: { id, adminId: { [Op.not]: null } }
    })

    if (!transaction)
      return httpError(errorTypes.TRANSACTION_NOT_CREATED_BY_ADMIN, res)

    const userWallet = await users.getBalance(userId)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

    const balanceAfter =
      change === 'decrease' && userWallet?.data?.balance >= amount
        ? userWallet?.data?.balance - amount
        : amount - userWallet?.data?.balance

    const t = await sequelize.transaction()

    await transaction.update(
      {
        adminId,
        userId,
        type: 'admin',
        change,
        balance: userWallet?.data?.balance,
        balanceAfter:
          change === 'decrease'
            ? balanceAfter
            : userWallet?.data?.balance + amount,
        status: 'successful',
        amount,
        description
      },
      { transaction: t }
    )

    if (userId !== transaction?.userId) {
      const oldUser = await sequelize.models.users.findOne({
        where: { id: transaction?.id }
      })

      const oldUserNewBalance =
        change === 'decrease' && oldUser.balance >= amount
          ? oldUser - amount
          : amount - oldUser

      await oldUser.update(
        {
          balance:
            change === 'decrease'
              ? oldUserNewBalance
              : oldUser?.balance + transaction?.amount
        },
        {
          where: {
            id: transaction?.userId
          }
        },
        {
          transaction: t
        }
      )
    }
    await user.update({ balance: balanceAfter }, { transaction: t })

    await t.commit()

    return res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    httpError(e, res)
  }
}

const totalTransactions = async (req, res) => {
  try {
    const { ticker } = req.params
    const { startAt, endAt, month } = req.query
    const where = { [Op.or]: [{ status: 'successful' }, { status: 'pending' }] }

    if (ticker !== 'monthly' && ticker !== 'yearly')
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    if (ticker === 'monthly' && _.isEmpty(month))
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    const timeList = utils.createTimeListForTotalTransactions(ticker, month)

    if (startAt) where.createdAt = { [Op.gte]: startAt }
    if (endAt) where.createdAt = { [Op.lte]: endAt }

    const transactions = await sequelize.models.transactions.findAll({
      where
    })

    for (const transaction of transactions) {
      const createdAt = new utils.PersianDate(transaction.createdAt)
      if (ticker === 'monthly') {
        const transactionCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === transactionCreatedAt
        )

        if (findedCreatedAt) {
          if (transaction?.change === 'decrease')
            findedCreatedAt.debtor += transaction?.amount
          else findedCreatedAt.creditor += transaction?.amount
        }
      } else if (ticker === 'yearly') {
        const transactionCreatedAt = utils.dateFormat(createdAt.getMonth())
        const findedCreatedAt = timeList.find(
          (item) => item.time === String(transactionCreatedAt)
        )
        if (findedCreatedAt) {
          if (transaction?.change === 'decrease')
            findedCreatedAt.debtor += transaction?.amount
          else findedCreatedAt.creditor += transaction?.amount
        }
      }
    }

    let incoming = 0
    let outgoing = 0

    for (const transaction of transactions) {
      if (transaction?.change === 'increase')
        incoming += parseInt(transaction?.amount)
      else outgoing += parseInt(transaction?.amount)
    }

    res.status(200).send({
      statusCode: 200,
      data: {
        totalDebtor: outgoing,
        totalCreditor: incoming,
        chart: timeList
      },
      error: null
    })
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

const create = async (req, res) => {
  try {
    const adminId = req?.user[0]?.id
    const { userId, type, amount, description } = req.body
    const change = type === 'debtor' ? 'decrease' : 'increase'

    const user = await sequelize.models.users.findOne({
      where: { id: userId }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const userWallet = await users.getBalance(userId)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

    const balanceAfter =
      change === 'decrease' && userWallet?.data?.balance >= amount
        ? userWallet?.data?.balance - amount
        : amount - userWallet?.data?.balance

    const t = await sequelize.transaction()

    await sequelize.models.transactions.create(
      {
        adminId,
        userId,
        type: 'admin',
        change,
        balance: userWallet?.data?.balance,
        balanceAfter:
          change === 'decrease'
            ? balanceAfter
            : userWallet?.data?.balance + amount,
        status: 'successful',
        amount,
        description
      },
      { transaction: t }
    )

    await user.update({ balance: balanceAfter }, { transaction: t })

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    httpError(e, res)
  }
}

const softDelete = async (req, res) => {
  try {
    const { id } = req.params

    const transaction = await sequelize.models.transactions.findOne({
      where: {
        id,
        adminId: { [Op.not]: null }
      }
    })

    if (!transaction)
      return httpError(errorTypes.ADMIN_CANT_DELETE_NORMAL_TRANSACTION, res)

    const r = await transactions.Delete({ req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = {
  findAll,
  findOne,
  update,
  softDelete,
  create,
  totalTransactions
}
