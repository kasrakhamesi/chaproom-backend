const { sequelize } = require('../models')
const { gateways } = require('.')
const { httpError, errorTypes } = require('../configs')
const { Op } = require('sequelize')
const libs = require('../libs')
require('dotenv').config()

const getBalance = async (userId) => {
  try {
    const userTransactions = await sequelize.models.transactions.findAll({
      where: {
        userId,
        [Op.or]: [{ status: 'successful' }, { status: 'pending' }]
      }
    })

    let incoming = 0
    let outgoing = 0
    let marketingBalance = 0
    for (const transaction of userTransactions) {
      if (transaction?.change === 'increase') {
        if (
          transaction?.type === 'marketing_discount' ||
          transaction?.type === 'marketing_referral'
        )
          marketingBalance += parseInt(transaction?.amount)
        incoming += parseInt(transaction?.amount)
      } else outgoing += parseInt(transaction?.amount)
    }

    const balance = incoming - outgoing

    return {
      isSuccess: true,
      data: {
        outgoing,
        incoming,
        balance,
        marketingBalance
      }
    }
  } catch (e) {
    return {
      isSuccess: false,
      message: e.message
    }
  }
}

const updateFolderFiles = async (folders, userId, transaction, orderId) => {
  try {
    let error = false
    for (const folder of folders) {
      if (error) return false
      const filesPath = []
      for (const file of folder?.files) filesPath.push(file?.uniqueName)

      const rArchive = libs.folders.archiveFiles(
        filesPath,
        userId,
        folder?.id,
        orderId
      )
      if (rArchive === false) {
        error = true
        return false
      }

      await sequelize.models.folders.update(
        { filesUrl: rArchive },
        {
          where: {
            id: folder?.id
          }
        },
        {
          transaction
        }
      )
    }
    return true
  } catch {
    return false
  }
}

const createOrder = async (
  userId,
  gatewayPayAmount,
  walletPayAmount,
  folders,
  data,
  res
) => {
  try {
    const zarinpal = gateways.zarinpal.create(
      process.env.ZARINPAL_MERCHANT,
      Boolean(parseInt(process.env.ZARINPAL_SANDBOX))
    )

    const user = await sequelize.models.users.findOne({
      where: {
        id: userId
      }
    })

    const payment = await zarinpal.PaymentRequest({
      Amount: parseInt(gatewayPayAmount),
      CallbackURL: process.env.PAYMENT_CALLBACK,
      Description: `ثبت سفارش کاربر ${user?.name} به شماره تماس ${user?.phoneNumber} در استان ${data?.recipientDeliveryProvince} و شهر ${data?.recipientDeliveryCity} با تعداد ${folders?.length} پوشه`
    })

    if (payment?.status !== 100) return httpError(errorTypes.GATEWAY_ERROR, res)

    const t = await sequelize.transaction()

    const paymentCreated = await sequelize.models.payments.create(
      {
        userId,
        amount: gatewayPayAmount,
        authority: payment?.authority
      },
      { transaction: t }
    )

    if (!paymentCreated) return httpError(errorTypes.GATEWAY_ERROR, res)
    data.paymentId = paymentCreated?.id
    data.gatewayPaidAmount = gatewayPayAmount
    data.walletPaidAmount = walletPayAmount

    const r = await libs.utils.upsert(
      sequelize.models.orders,
      data,
      { addressId: null, userId },
      t
    )

    if (!r) return httpError(errorTypes.INVALID_INPUTS, res)

    const rUpdateFoldersFiles = await updateFolderFiles(
      folders,
      userId,
      t,
      r?.id
    )
    if (rUpdateFoldersFiles === false)
      return httpError(errorTypes.CONTACT_TO_ADMIN, res)

    for (const folder of folders) {
      await sequelize.models.order_folders.create(
        {
          userId,
          folderId: folder?.id,
          orderId: r?.id
        },
        { transaction: t }
      )
    }

    await t.commit()

    return res.status(201).send({
      statusCode: 201,
      data: {
        orderType: 'payment',
        paymentUrl: payment?.url,
        payableAmount: gatewayPayAmount
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const submitOrder = async (
  userId,
  paymentId,
  paymentAmount,
  refId,
  walletPaidAmount
) => {
  try {
    const order = await sequelize.models.orders.findOne({
      where: {
        userId,
        paymentId,
        status: 'payment_pending'
      }
    })

    if (!order) return null
    const userWallet = await getBalance(userId)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message)

    const t = await sequelize.transaction()

    await sequelize.models.transactions.create(
      {
        userId,
        orderId: order?.id,
        type: 'order',
        change: 'decrease',
        status: 'successful',
        amount: paymentAmount + walletPaidAmount,
        description: 'ثبت سفارش'
      },
      { transaction: t }
    )

    const user = await sequelize.models.users.findOne(
      {
        where: {
          id: userId
        }
      },
      { transaction: t }
    )

    await user.update(
      {
        balance:
          userWallet?.data?.balance - paymentAmount - walletPaidAmount <= 0
            ? 0
            : userWallet?.data?.balance - paymentAmount - walletPaidAmount
      },
      { transaction: t }
    )

    await order.update(
      {
        status: 'pending'
      },
      { transaction: t }
    )

    await t.commit()

    await sequelize.models.folders.update(
      { used: true },
      { where: { userId, used: false } }
    )

    return {
      statusCode: 200,
      data: {
        id: paymentId,
        orderId: order?.id,
        message: 'پرداخت با موفقعیت انجام شد',
        amount: paymentAmount + walletPaidAmount,
        refId
      },
      error: null
    }
  } catch {
    return null
  }
}

const getTransactionTypeAndAmount = async (transaction) => {
  try {
    let type =
      transaction?.type === 'withdrawal'
        ? 'بدهکار'
        : transaction?.type === 'marketing_referral'
        ? 'بازاریابی'
        : transaction?.type === 'marketing_discount'
        ? 'بازاریابی'
        : 'بستانکار'

    if (transaction?.adminId !== null && transaction?.type === 'admin')
      return {
        type: transaction?.change === 'decrease' ? 'بدهکار' : 'بستانکار',
        amount: transaction?.amount
      }
    else if (transaction?.orderId === null)
      return { type, amount: transaction?.amount }

    const order = await sequelize.models.orders.findOne({
      where: {
        id: transaction?.orderId
      }
    })

    let amount = transaction?.amount
    if (order?.status === 'canceled') type = order?.cancelReason
    else if (order?.gatewayPaidAmount === 0) type = 'خرج کیف پول'
    else if (order?.walletPaidAmount !== 0 && order?.gatewayPaidAmount !== 0) {
      type = 'بستانکار'
      amount = order?.gatewayPaidAmount
    } else if (order?.gatewayPaidAmount !== 0) {
      type = 'بستانکار'
      amount = order?.gatewayPaidAmount + order?.walletPaidAmount
    }

    if (transaction?.description === 'ثبت سفارش') type = 'بستانکار'

    return {
      type:
        order?.status === 'canceled' && type !== 'بستانکار'
          ? `بازگشت وجه به کیف پول \n ${type}`
          : type,
      amount
    }
  } catch {
    return { type: transaction?.type, amount: transaction?.amount }
  }
}

module.exports = {
  getBalance,
  submitOrder,
  createOrder,
  updateFolderFiles,
  getTransactionTypeAndAmount
}
