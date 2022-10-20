const { sequelize } = require('../../models')
const { gateways } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
require('dotenv').config()

const withdrawal = async (req, res) => {
  try {
    const { iban, amount } = req.body

    if (typeof amount !== 'number')
      return httpError(errorTypes.INVALID_AMOUNT_TYPE, res)

    const userId = req?.user[0]?.id

    const data = {
      iban: String(iban),
      amount,
      userId
    }

    const userTransactions = await sequelize.models.transactions.findAll({
      where: {
        userId: payment?.userId,
        status: 'approved'
      }
    })

    let incoming = 0
    let outgoing = 0

    for (const transaction of userTransactions) {
      if (transaction?.change === 'increase')
        incoming += parseInt(transaction?.amount)
      else outgoing += parseInt(transaction?.amount)
    }

    outgoing = await Promise.all(outgoing)
    incoming = await Promise.all(incoming)

    const balance = incoming - outgoing

    if (balance < amount) return httpError(errorTypes.INSUFFICIENT_FUNDS, res)

    const t = await sequelize.transaction()

    const r = await sequelize.models.withdrawals.create(data, {
      transaction: t
    })

    await sequelize.models.transactions.create(
      {
        userId,
        withdrawalId: r?.id,
        type: 'withdrawal',
        change: 'decrease',
        balance,
        balanceAfter: balance - amount,
        status: 'pending',
        amount,
        description: 'برداشت وجه'
      },
      { transaction: t }
    )

    await transaction.commit()

    res.status(201).send({
      statusCode: 201,
      data: r,
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const deposit = async (req, res) => {
  try {
    const { amount } = req.body
    const userId = req?.user[0]?.id

    if (typeof amount !== 'number')
      return httpError(errorTypes.INVALID_AMOUNT_TYPE, res)

    const zarinpal = gateways.zarinpal.create(
      process.env.ZARINPAL_MERCHANT,
      true
    )
    const payment = await zarinpal.PaymentRequest({
      Amount: parseInt(amount),
      CallbackURL: process.env.PAYMENT_CALLBACK,
      Description: 'افزایش موجودی کیف پول'
    })

    if (payment?.status !== 100) return httpError(errorTypes.GATEWAY_ERROR, res)

    const r = await sequelize.models.payments.create({
      userId,
      amount,
      authority: payment?.authority
    })

    if (!r) return httpError(errorTypes.GATEWAY_ERROR, res)

    return res.status(201).send({
      statusCode: 201,
      data: {
        paymentUrl: payment?.url,
        amount
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { deposit, withdrawal }
