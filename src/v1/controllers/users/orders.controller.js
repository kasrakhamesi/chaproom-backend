const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')

const create = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const totalPrice = 0

    const { folders, addressId, paidWithWallet } = req.body

    const address = await sequelize.models.addresses.findOne({
      where: {
        userId,
        id: addressId
      }
    })

    if (!address) return httpError(errorTypes.INVALID_ADDRESS, res)

    if (_.isEmpty(folders)) return httpError(errorTypes.MISSING_FOLDERS, res)

    const data = {
      addressId,
      recipientName: address?.recipientName,
      recipientPhoneNumber: address?.recipientPhoneNumber,
      recipientPostalCode: address?.recipientPostalCode,
      recipientDeliveryProvince: address?.recipientDeliveryProvince,
      recipientDeliveryCity: address?.recipientDeliveryCity,
      recipientDeliveryAddress: address?.recipientDeliveryAddress,
      status: 'pending',
      price: test
    }

    if (paidWithWallet) {
      const user = await sequelize.models.users.findOne({
        where: {
          id: userId
        }
      })

      const balance = user?.balance

      if (balance >= totalPrice) {
        const r = await sequelize.models.orders.create(data)
      } else {
        const priceLeft = totalPrice - balance

        const zarinpal = gateways.zarinpal.create(
          process.env.ZARINPAL_MERCHANT,
          true
        )
        const payment = await zarinpal.PaymentRequest({
          Amount: parseInt(priceLeft),
          CallbackURL: process.env.PAYMENT_CALLBACK,
          Description: 'افزایش موجودی کیف پول'
        })

        if (payment?.status !== 100)
          return httpError(errorTypes.GATEWAY_ERROR, res)

        const paymentCreated = await sequelize.models.payments.create({
          userId,
          amount: priceLeft,
          authority: payment?.authority
        })

        if (!r) return httpError(errorTypes.GATEWAY_ERROR, res)
        data.paymentId = paymentCreated?.id

        const r = await sequelize.models.orders.create(data)

        return res.status(201).send({
          statusCode: 201,
          data: {
            paymentUrl: payment?.url,
            amount
          },
          error: null
        })
      }
    }
  } catch (e) {
    return httpError(e, res)
  }
}

const findAll = (req, res) => {}

const findOne = (req, res) => {}

const update = (req, res) => {}

module.exports = { create, findAll, findOne, update }
