const { sequelize } = require('../models')
const { gateways } = require('.')
const { httpError, errorTypes } = require('../configs')
require('dotenv').config()

const getBalance = async (userId) => {
  try {
    const userTransactions = await sequelize.models.transactions.findAll({
      where: {
        userId,
        status: 'successful'
      }
    })

    let incoming = 0
    let outgoing = 0

    for (const transaction of userTransactions) {
      if (transaction?.change === 'increase')
        incoming += parseInt(transaction?.amount)
      else outgoing += parseInt(transaction?.amount)
    }

    const balance = incoming - outgoing

    return {
      isSuccess: true,
      data: {
        outgoing,
        incoming,
        balance
      }
    }
  } catch (e) {
    console.log(e)
    return {
      isSuccess: false,
      message: e.message
    }
  }
}

const createOrder = async (
  userId,
  gatewayPayAmount,
  walletPayAmount,
  folders,
  data
) => {
  try {
    const zarinpal = gateways.zarinpal.create(
      process.env.ZARINPAL_MERCHANT,
      true
    )

    const payment = await zarinpal.PaymentRequest({
      Amount: parseInt(gatewayPayAmount),
      CallbackURL: process.env.PAYMENT_CALLBACK,
      Description: 'افزایش موجودی کیف پول'
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

    const r = await sequelize.models.orders.create(data, {
      transaction: t
    })

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

    return {
      statusCode: 201,
      data: {
        orderType: 'payment',
        paymentUrl: payment?.url,
        payableAmount: gatewayPayAmount
      },
      error: null
    }
  } catch (e) {
    return httpError(e)
  }
}

const submitOrder = async (
  userId,
  paymentId,
  paymentAmount,
  refId,
  transaction
) => {
  const order = await sequelize.models.orders.findOne({
    where: {
      userId,
      paymentId,
      status: 'payment_pending'
    }
  })

  if (!order) return null
  const userWallet = await getBalance(userId)

  if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

  await sequelize.models.transactions.create(
    {
      userId,
      orderId: order?.id,
      type: 'order',
      change: 'decrease',
      balance: userWallet?.data?.balance,
      balanceAfter: userWallet?.data?.balance - paymentAmount,
      status: 'successful',
      amount: paymentAmount,
      description: 'ثبت سفارش'
    },
    { transaction }
  )

  await order.update(
    {
      status: 'pending'
    },
    { transaction }
  )

  return {
    statusCode: 200,
    data: {
      id: paymentAmount,
      orderId: order?.id,
      message: 'پرداخت با موفقعیت انجام شد',
      amount: paymentId,
      refId
    },
    error: null
  }
}

module.exports = { getBalance, submitOrder, createOrder }
