const { sequelize } = require('../../models')
const { gateways, utils, users } = require('../../libs')
const _ = require('lodash')
require('dotenv').config()

const callback = async (req, res) => {
  try {
    const { Authority, Status } = req.query

    const payment = await sequelize.models.payments.findOne({
      where: {
        authority: Authority
      }
    })

    const order = await sequelize.models.orders.findOne({
      where: {
        paymentId: payment?.id
      }
    })

    if (Status !== 'OK') {
      if (!payment)
        return res.redirect(
          `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
        )

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
      Boolean(parseInt(process.env.ZARINPAL_SANDBOX))
    )
    const paymentVerification = await zarinpal.PaymentVerification({
      Amount: payment?.amount,
      Authority
    })

    if (String(paymentVerification?.status) !== '100') {
      await payment.update({
        status: Status,
        refId: paymentVerification?.RefID || null,
        verifiedStatus: paymentVerification?.status || null,
        fullResponse: JSON.stringify(paymentVerification),
        verifiedAt: utils.timestampToIso(Date.now())
      })

      return res.redirect(
        `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
      )
    }
    const userWallet = await users.getBalance(payment?.userId)

    if (!userWallet?.isSuccess)
      return res.redirect(
        `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
      )

    const t = await sequelize.transaction()

    await payment.update(
      {
        status: Status,
        refId: paymentVerification?.RefID || null,
        verifiedStatus: paymentVerification?.status || null,
        fullResponse: JSON.stringify(paymentVerification),
        verifiedAt: utils.timestampToIso(Date.now())
      },
      { transaction: t }
    )

    await sequelize.models.transactions.create(
      {
        userId: payment?.userId,
        paymentId: payment?.id,
        type: 'deposit',
        change: 'increase',
        status: 'successful',
        amount: payment?.amount,
        description: order ? 'increase_for_order' : 'افزایش موجودی کیف پول'
      },
      { transaction: t }
    )

    const user = await sequelize.models.users.findOne({
      where: {
        id: payment?.userId
      }
    })

    await user.update(
      {
        balance: userWallet?.data?.balance + payment?.amount,
        incomingPayment: user?.incomingPayment + parseInt(payment?.amount),
        totalCreditor: user?.totalCreditor + payment?.amount
      },
      { transaction: t }
    )

    await t.commit()

    const walletPaidAmount = parseInt(order?.walletPaidAmount) || 0

    const submitOrderResult = await users.submitOrder(
      payment?.userId,
      payment?.id,
      payment?.amount,
      paymentVerification?.RefID,
      walletPaidAmount
    )

    if (submitOrderResult !== null)
      return res.redirect(
        `${process.env.FRONT_DOMAIN}/dashboard/orders/payment-result?isSuccessful=true&orderId=${submitOrderResult?.data?.orderId}`
      )

    return res.redirect(
      `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=true&paymentId=${payment?.id}&amount=${payment?.amount}`
    )
  } catch {
    return res.redirect(
      `${process.env.FRONT_DOMAIN}/dashboard?isDeposit=true&isSuccessful=false`
    )
  }
}

module.exports = { callback }
