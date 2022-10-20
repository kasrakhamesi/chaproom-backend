const { sequelize } = require('../../models')
const { gateways, utils, users } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const _ = require('lodash')
const { submitOrder } = require('../../libs/users.lib')
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
    if (!_.isEmpty(payment.status))
      return httpError(errorTypes.PAYMENT_DOUBLE_SPENDING, res)

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

    const userWallet = await users.getBalance(payment?.userId)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

    const t = await sequelize.transaction()

    await sequelize.models.transactions.create(
      {
        userId: payment?.userId,
        paymentId: payment?.id,
        type: 'deposit',
        change: 'increase',
        balance: userWallet?.data?.balance,
        balanceAfter: userWallet?.data?.balance + payment?.amount,
        status: 'approved',
        amount: payment?.amount,
        description: 'افزایش موجودی کیف پول'
      },
      { transaction: t }
    )

    const user = await sequelize.models.users.findOne(
      {
        where: {
          id: payment?.userId
        }
      },
      { transaction: t }
    )

    await user.update(
      {
        balance: user?.balance + payment?.amount
      },
      { transaction: t }
    )

    const submitOrderResult = await submitOrder(
      payment?.userId,
      payment?.id,
      payment?.amount,
      paymentVerification?.RefID,
      t
    )

    await t.commit()

    if (submitOrderResult !== null)
      return res.status(submitOrderResult.statusCode).send(submitOrderResult)

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
    return httpError(e, res)
  }
}

module.exports = { callback }
