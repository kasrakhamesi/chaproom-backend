const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { gateways, restful, filters } = require('../../libs')
const orders = new restful(sequelize.models.orders)
const _ = require('lodash')

const create = async (req, res) => {
  try {
    console.log(req.body)

    const userId = req?.user[0]?.id

    const totalPrice = 10000

    const { folders, addressId, discountCode, paidWithWallet } = req.body

    const address = await sequelize.models.addresses.findOne({
      where: {
        userId,
        id: addressId
      }
    })

    if (!address) return httpError(errorTypes.INVALID_ADDRESS, res)

    if (!folders || _.isEmpty(folders))
      return httpError(errorTypes.MISSING_FOLDERS, res)

    const data = {
      addressId,
      userId,
      recipientName: address?.recipientName,
      recipientPhoneNumber: address?.recipientPhoneNumber,
      recipientPostalCode: address?.recipientPostalCode,
      recipientDeliveryProvince: address?.recipientDeliveryProvince,
      recipientDeliveryCity: address?.recipientDeliveryCity,
      recipientDeliveryAddress: address?.recipientDeliveryAddress,
      status: 'pending_payment',
      amount: 15000
    }

    if (paidWithWallet) {
      const user = await sequelize.models.users.findOne({
        where: {
          id: userId
        }
      })

      const balance = user?.balance

      if (balance >= totalPrice) {
        data.walletPaidAmount = balance
        data.status = 'pending'
        const r = await sequelize.models.orders.create(data)
        return res.status(201).send(r)
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

        const t = await sequelize.transaction()

        const paymentCreated = await sequelize.models.payments.create(
          {
            userId,
            amount: priceLeft,
            authority: payment?.authority
          },
          { transaction: t }
        )

        if (!paymentCreated) return httpError(errorTypes.GATEWAY_ERROR, res)
        data.paymentId = paymentCreated?.id
        data.gatewayPaidAmount = priceLeft
        data.walletPaidAmount = balance

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

        return res.status(201).send({
          statusCode: 201,
          data: {
            orderType: 'payment',
            paymentUrl: payment?.url,
            amount: priceLeft
          },
          error: null
        })
      }
    }
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

const priceCalculator = async (req, res) => {}

const findAll = async (req, res) => {
  try {
    const userId = req?.user[0]?.id
    const { page, pageSize } = req.query

    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.orders
    )

    const newWhere = { ...where, userId }

    const r = await orders.Get({
      where: newWhere,
      order,
      attributes: ['id', 'status', 'notFinishingReason', 'amount', 'createdAt'],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const findOne = (req, res) => {
  const userId = req?.user[0]?.id
  const { id } = req.params
  return sequelize.models.orders
    .findOne({
      where: {
        id,
        userId
      },
      attributes: {
        exclude: [
          'userId',
          'addressId',
          'discountId',
          'discountType',
          'discountValue',
          'paymentId',
          'adminId',
          'order_folders'
        ]
      },
      include: [
        {
          model: sequelize.models.folders,
          attributes: {
            exclude: ['userId']
          },
          through: {
            attributes: {
              exclude: [
                'userId',
                'createdAt',
                'updatedAt',
                'orderId',
                'folderId'
              ]
            }
          }
        }
      ]
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e)
    })
}

const update = (req, res) => {
  const { status, notFinishingReason } = req.body
  if (status !== 'canceled')
    return httpError(errorTypes.USER_ONLY_CAN_CANCEL_ORDER, res)

  const userId = req?.user[0]?.id
  const { id } = req.params

  const data = { status, notFinishingReason }
  return sequelize.models.orders
    .update(data, {
      where: {
        userId,
        id
      }
    })
    .then(() => {
      return res
        .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
        .send(messageTypes.SUCCESSFUL_UPDATE)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { create, findAll, findOne, update }
