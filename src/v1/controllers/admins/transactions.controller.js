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

    let newWhere
    const timeWhere = []
    if (startAt && endAt)
      timeWhere.push(
        {
          createdAt: { [Op.gte]: startAt }
        },
        {
          createdAt: { [Op.lte]: endAt }
        }
      )
    else if (startAt) timeWhere.push({ createdAt: { [Op.gte]: startAt } })
    else if (endAt)
      timeWhere.push({
        createdAt: { [Op.lte]: endAt }
      })
    else
      newWhere = {
        ...where,
        description: { [Op.not]: 'increase_for_order' },
        status: { [Op.not]: 'pending' }
      }

    if (_.isEmpty(newWhere))
      newWhere = [
        { [Op.and]: timeWhere },
        { [Op.and]: where || [] },
        { [Op.and]: { description: { [Op.not]: 'increase_for_order' } } },
        { [Op.and]: { status: { [Op.not]: 'pending' } } }
      ]

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
        exclude: ['userId', 'withdrawalId', 'adminId', 'paymentId']
      },
      where: newWhere,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    const newTransactions = []
    for (const transaction of r?.data?.transactions) {
      const transactionInfo = await users.getTransactionTypeAndAmount(
        transaction
      )

      newTransactions.push({
        id: transaction.id,
        orderId: transaction.orderId,
        type: transactionInfo?.type,
        status: transaction.status,
        amount: transactionInfo?.amount,
        description: transaction.description,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        user: transaction.user,
        admin: transaction.admin
      })
    }

    res.status(r?.statusCode).send({
      statusCode: r?.statusCode,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        transactions: newTransactions
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
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
        exclude: ['userId', 'withdrawalId', 'adminId', 'paymentId', 'type']
      },
      where: {
        id,
        adminId: { [Op.not]: null }
      }
    })

    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

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
    return httpError(e, res)
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

    await transaction.update(
      {
        adminId,
        userId,
        type: 'admin',
        change,
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
    await user.update(
      {
        balance:
          change === 'decrease'
            ? balanceAfter
            : userWallet?.data?.balance + amount
      },
      { transaction: t }
    )

    return res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    return httpError(e, res)
  }
}

const totalTransactions = async (req, res) => {
  try {
    const { ticker } = req.params
    const { startAt, endAt, month } = req.query
    const where = { status: 'successful' }

    if (ticker !== 'monthly' && ticker !== 'yearly')
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    if (ticker === 'monthly' && _.isEmpty(month))
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    const timeList = utils.createTimeListForTotalTransactions(ticker, month)

    let newWhere
    const timeWhere = []
    if (startAt && endAt)
      timeWhere.push(
        {
          createdAt: { [Op.gte]: startAt }
        },
        {
          createdAt: { [Op.lte]: endAt }
        }
      )
    else if (startAt) timeWhere.push({ createdAt: { [Op.gte]: startAt } })
    else if (endAt)
      timeWhere.push({
        createdAt: { [Op.lte]: endAt }
      })
    else
      newWhere = {
        ...where,
        description: { [Op.not]: 'increase_for_order' },
        status: 'successful'
      }

    if (_.isEmpty(newWhere))
      newWhere = [
        { [Op.and]: timeWhere },
        { [Op.and]: where || [] },
        { [Op.and]: { description: { [Op.not]: 'increase_for_order' } } },
        { [Op.and]: { status: 'successful' } }
      ]

    const transactions = await sequelize.models.transactions.findAll({
      where: newWhere
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
          const transactionInfo = await users.getTransactionTypeAndAmount(
            transaction
          )

          if (transactionInfo?.type === 'بدهکار')
            findedCreatedAt.debtor += transactionInfo?.amount
          else if (transactionInfo?.type === 'بستانکار')
            findedCreatedAt.creditor += transactionInfo?.amount
        }
      } else if (ticker === 'yearly') {
        const transactionCreatedAt = utils.dateFormat(createdAt.getMonth())
        const findedCreatedAt = timeList.find(
          (item) => item.time === String(transactionCreatedAt)
        )
        if (findedCreatedAt) {
          const transactionInfo = await users.getTransactionTypeAndAmount(
            transaction
          )

          if (transactionInfo?.type === 'بدهکار')
            findedCreatedAt.debtor += transactionInfo?.amount
          else if (transactionInfo?.type === 'بستانکار')
            findedCreatedAt.creditor += transactionInfo?.amount
        }
      }
    }

    let totalDebtor = 0
    let totalCreditor = 0

    for (const transaction of transactions) {
      const transactionInfo = await users.getTransactionTypeAndAmount(
        transaction
      )

      if (transactionInfo?.type === 'بدهکار')
        totalDebtor += parseInt(transaction?.amount)
      else if (transactionInfo?.type === 'بستانکار')
        totalCreditor += parseInt(transaction?.amount)
    }

    res.status(200).send({
      statusCode: 200,
      data: {
        totalDebtor,
        totalCreditor,
        chart: timeList
      },
      error: null
    })
  } catch (e) {
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

    await sequelize.models.transactions.create({
      adminId,
      userId,
      type: 'admin',
      change,
      status: 'successful',
      amount,
      description
    })

    const userWallet = await users.getBalance(userId)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

    await user.update({
      balance: userWallet?.data?.balance
    })

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
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

    const user = await sequelize.models.users.findOne({
      where: {
        id: transaction?.userId
      }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const t = await sequelize.transaction()

    await transaction.destroy({
      transaction: t
    })

    const userWallet = await users.getBalance(user?.id)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

    const balanceAfter =
      transaction?.change === 'decrease' &&
      userWallet?.data?.balance >= transaction?.amount
        ? userWallet?.data?.balance - transaction?.amount
        : transaction?.amount - userWallet?.data?.balance

    await user.update({
      balance:
        change === 'decrease'
          ? balanceAfter
          : userWallet?.data?.balance + transaction?.amount
    })

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    return httpError(e, res)
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
