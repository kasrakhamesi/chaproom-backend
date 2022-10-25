const { sequelize } = require('../../models')
const { gateways, users } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
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

    const userWallet = await users.getBalance(userId)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

    if (userWallet.data.balance < amount)
      return httpError(errorTypes.INSUFFICIENT_FUNDS, res)

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
        balance: userWallet.data.balance,
        balanceAfter: userWallet.data.balance - amount,
        status: 'pending',
        amount,
        description: 'برداشت وجه'
      },
      { transaction: t }
    )

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
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
        message: 'صفحه پرداخت با موفقعیت ساخته شد',
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
