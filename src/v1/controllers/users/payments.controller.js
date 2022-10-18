const { sequelize } = require('../../models')
const { gateways, utils } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
require('dotenv').config()

const callback = async (req, res) => {
  try {
    const { Authority, Status } = req.query

    if (Status !== 'OK') return httpError(errorTypes.PAYMENT_FAILED, res)

    const payment = await sequelize.models.payments.findOne({
      where: {
        authority: Authority
      }
    })

    if (!payment) return httpError(errorTypes.PAYMENT_FAILED, res)

    const zarinpal = gateways.zarinpal.create(
      process.env.ZARINPAL_MERCHANT,
      true
    )
    const paymentVerification = await zarinpal.PaymentVerification({
      Amount: payment?.amount,
      Authority
    })

    await payment.update({
      status: Status,
      refId: paymentVerification?.RefID || null,
      verifiedStatus: paymentVerification?.status || null,
      fullResponse: JSON.stringify(paymentVerification),
      verifiedAt: utils.timestampToIso(Date.now())
    })

    if (String(paymentVerification?.status) !== '100')
      return httpError(errorTypes.PAYMENT_VERIFICATION_FAILED, res)

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

    sequelize.models.transactions.create({
      userId: payment?.userId,
      paymentId: payment?.id,
      type: 'deposit',
      change: 'increase',
      balance,
      balanceAfter: balance + payment?.amount,
      status: 'approved',
      amount: payment?.amount,
      description: 'افزایش موجودی کیف پول'
    })

    const user = await sequelize.models.users.findOne({
      where: {
        id: payment?.userId
      }
    })

    await user.update({
      balance: balance + payment?.amount
    })

    res.status(200).send({
      statusCode: 200,
      data: {
        id: payment?.id,
        message: 'پرداخت با موفقعیت انجام شد',
        amount: payment?.amount,
        refId: paymentVerification?.RefID
      },
      error: null
    })
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

module.exports = { callback }
