const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { restful, filters, users, discounts, utils } = require('../../libs')
const orders = new restful(sequelize.models.orders)
const { Op } = require('sequelize')
const _ = require('lodash')
const { calculator } = require('../../libs/discounts.lib')

const ONE_MOUNTH = 1000 * 60 * 60 * 24 * 30

const create = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const totalPrice = 150000

    const { addressId, discountCode, paidWithWallet } = req.body

    const referral = await sequelize.models.referrals.findOne({
      where: {
        userId,
        referralUserId: { [Op.not]: null }
      }
    })

    let referralUserId = null

    if (
      referral &&
      Date.now() < utils.isoToTimestamp(referral?.createdAt) + ONE_MOUNTH
    )
      referralUserId = referral?.referralUserId

    const address = await sequelize.models.addresses.findOne({
      where: {
        userId,
        id: addressId
      }
    })

    if (!address) return httpError(errorTypes.INVALID_ADDRESS, res)

    const folders = await sequelize.models.folders.findAll({
      where: {
        userId,
        used: false
      }
    })

    const data = {
      addressId,
      userId,
      referralUserId,
      recipientName: address?.recipientName,
      recipientPhoneNumber: address?.recipientPhoneNumber,
      recipientPostalCode: address?.recipientPostalCode,
      recipientDeliveryProvince: address?.recipientDeliveryProvince,
      recipientDeliveryCity: address?.recipientDeliveryCity,
      recipientDeliveryAddress: address?.recipientDeliveryAddress,
      status: 'payment_pending',
      amount: 15000
    }

    let discount = null
    if (discountCode) discount = await discounts.check(discountCode)

    if (discount !== null && discount?.statusCode !== 200)
      return httpError(discount, res)

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
        const t = await sequelize.transaction()
        const r = await sequelize.models.orders.create(data, { transaction: t })
        await sequelize.models.folders.update(
          { used: true },
          { where: { userId, used: false } },
          {
            transaction: t
          }
        )
        await t.commit()

        return res.status(messageTypes.SUCCESSFUL_CREATED.statusCode).send({
          statusCode: messageTypes.SUCCESSFUL_CREATED.statusCode,
          data: {
            id: r?.id,
            message: messageTypes.SUCCESSFUL_CREATED.data.message
          },
          error: null
        })
      } else {
        const gatewayPayAmount = totalPrice - balance

        const r = await users.createOrder(
          userId,
          gatewayPayAmount,
          balance,
          folders,
          data
        )
        return res.status(r?.statusCode).send(r)
      }
    }

    const r = await users.createOrder(userId, totalPrice, 0, folders, data)
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

const priceCalculator = async (req, res) => {
  try {
    const userId = req?.user[0]?.id
    const { discountCode } = req.body
    let discount = null
    if (discountCode) discount = await discounts.check(discountCode)

    if (discount !== null && discount?.statusCode !== 200)
      return httpError(discount, res)

    const folders = await sequelize.models.folders.findAll({
      where: {
        userId,
        used: false
      },
      attributes: ['id', 'amount']
    })

    const user = await sequelize.models.users.findOne({
      where: { id: userId },
      attributes: ['balance']
    })

    const amounts = []
    let amount = 0
    for (let k = 0; k < folders.length; k++) {
      amounts.push(1000)
      amount += 1000
    }

    const data = {
      discountAmount:
        discount !== null
          ? await calculator(discount?.data, amount + 20000)
          : null,
      userBalance: user?.balance,
      foldersAmount: amounts,
      postageFee: 20000
    }

    return res.status(200).send({
      statusCode: 200,
      data,
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

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
      attributes: ['id', 'status', 'cancelReason', 'amount', 'createdAt'],
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
          'order_folders',
          'referralId'
        ]
      },
      include: [
        {
          model: sequelize.models.folders,
          attributes: {
            exclude: ['userId', 'used']
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
      const folders = r?.folders.map((item) => {
        if (item?.binding !== null) {
          item.binding = JSON.parse(item?.binding)
          return item
        }
        return item
      })
      r.folders = folders
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

const update = async (req, res) => {
  try {
    const userId = req?.user[0]?.id
    const { id } = req.params

    const data = { status: 'canceled', cancelReason: 'لغو شخصی' }
    const t = await sequelize.transaction()

    const order = await sequelize.models.orders.findOne({
      where: {
        userId,
        id
      }
    })

    await order.update(data, { transaction: t })

    const userWallet = await users.getBalance(userId)

    if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

    await sequelize.models.transactions.create(
      {
        userId,
        orderId: id,
        type: 'deposit',
        change: 'increase',
        balance: userWallet?.data?.balance,
        balanceAfter: userWallet?.data?.balance + order?.amount,
        status: 'successful',
        amount: order?.amount,
        description: 'لغو کردن سفارش توسط کاربر'
      },
      { transaction: t }
    )

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { create, findAll, findOne, update, priceCalculator }
