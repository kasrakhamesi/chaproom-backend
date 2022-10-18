const { sequelize } = require('../../models')
const { gateways } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
require('dotenv').config()

const withdrawal = (req, res) => {
  const { iban, amount } = req.body

  if (typeof amount !== 'number')
    return httpError(errorTypes.INVALID_AMOUNT_TYPE, res)

  const userId = req?.user[0]?.id

  const data = {
    iban: String(iban),
    amount,
    userId
  }

  return sequelize.models.withdrawals
    .create(data)
    .then((r) => {
      return res.status(201).send({
        statusCode: 201,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
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
