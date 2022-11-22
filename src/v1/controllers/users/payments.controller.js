const { sequelize } = require('../../models')
const { gateways, utils, users } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const _ = require('lodash')
const { submitOrder } = require('../../libs/users.lib')
require('dotenv').config()

const callback = async (req, res) => {
  try {
    const { Authority, Status } = req.query

    const payment = await sequelize.models.payments.findOne({
      where: {
        authority: Authority
      }
    })

    if (Status !== 'OK') {
      if (!payment)
        return res.redirect(
          `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
        )

      const order = await sequelize.models.orders.findOne({
        where: {
          paymentId: payment?.id
        }
      })

      await payment.update({
        status: Status
      })

      if (order)
        return res.redirect(
          `${process.env.FRONT_DOMAIN}/dashboard/orders/payment-result?isSuccessful=false&orderId=${order?.orderId}`
        )
      return res.redirect(
        `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
      )
    }

    if (!_.isEmpty(payment.status))
      return res.redirect(
        `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
      )

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
      return res.redirect(
        `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
      )
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
        status: 'successful',
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
      return res.redirect(
        `${process.env.FRONT_DOMAIN}/dashboard/orders/payment-result?isSuccessful=true&orderId=${submitOrderResult?.data?.orderId}`
      )

    return res.redirect(
      `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=true&paymentId=${payment?.id}&amount=${payment?.amount}`
    )
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

module.exports = { callback }
