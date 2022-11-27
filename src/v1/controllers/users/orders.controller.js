const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { restful, filters, users, discounts, utils } = require('../../libs')
const orders = new restful(sequelize.models.orders)
const { Op } = require('sequelize')
const _ = require('lodash')

const ONE_MOUNTH = 1000 * 60 * 60 * 24 * 30

const create = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const { addressId, discountCode, paidWithWallet } = req.body

    if (typeof addressId !== 'number')
      return httpError(errorTypes.INVALID_INPUTS, res)

    if (typeof paidWithWallet !== 'boolean')
      return httpError(errorTypes.INVALID_INPUTS, res)

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
      include: [
        {
          model: sequelize.models.files,
          attributes: {
            exclude: ['userId', 'folder_files']
          },
          through: {
            attributes: {
              exclude: [
                'userId',
                'createdAt',
                'updatedAt',
                'fileId',
                'folderId'
              ]
            }
          }
        }
      ],
      where: {
        userId,
        used: false
      }
    })

    if (_.isEmpty(folders)) return httpError(errorTypes.DONT_HAVE_FOLDERS, res)

    let postageFee = 20000
    let totalPrice = 0
    for (const entity of folders) {
      totalPrice += entity?.amount
    }

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
      amount: totalPrice
    }

    if (referralUserId !== null) {
      data.referralCommission = referral?.commission || 10
      data.referralBenefit = parseInt(
        (totalPrice * referral?.commission || 10) / 100
      )
    }

    let discount = null
    if (discountCode) discount = await discounts.check(discountCode)

    if (discount !== null && discount?.statusCode !== 200)
      return httpError(discount, res)

    const discountAmount =
      discount !== null
        ? await discounts.calculator(discount?.data, totalPrice)
        : 0

    if (discountAmount !== 0) {
      data.discountId = discount?.data?.id
      data.discountType = discount?.data?.type
      data.discountValue = discount?.data?.value
      data.discountCode = discount?.data?.code
      data.discountAmount = discountAmount
      data.discountBenefit = discountAmount
    }

    if (paidWithWallet) {
      const user = await sequelize.models.users.findOne({
        where: {
          id: userId
        }
      })

      const balance = user?.balance

      if (balance >= totalPrice + postageFee - discountAmount) {
        data.walletPaidAmount = totalPrice + postageFee - discountAmount
        data.status = 'pending'
        const t = await sequelize.transaction()

        const r = await utils.upsert(
          sequelize.models.orders,
          data,
          { addressId: null, userId },
          t
        )

        if (!r) return httpError(errorTypes.INVALID_INPUTS, res)

        const rUpdateFiles = await users.updateFolderFiles(
          folders,
          userId,
          t,
          r?.id || 0
        )

        if (rUpdateFiles === false)
          return httpError(errorTypes.CONTACT_TO_ADMIN, res)

        await sequelize.models.folders.update(
          { used: true },
          { where: { userId, used: false } },
          {
            transaction: t
          }
        )

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

        const userWallet = await users.getBalance(userId)

        if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

        await sequelize.models.transactions.create(
          {
            userId,
            orderId: r?.id,
            type: 'order',
            change: 'decrease',
            balance: userWallet?.data?.balance,
            balanceAfter: userWallet?.data?.balance - data.walletPaidAmount,
            status: 'successful',
            amount: data.walletPaidAmount,
            description: 'ثبت سفارش'
          },
          { transaction: t }
        )

        await user.update(
          { balance: userWallet?.data?.balance - data.walletPaidAmount },
          { transaction: t }
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
        const gatewayPayAmount =
          totalPrice - discountAmount + postageFee - balance

        return await users.createOrder(
          userId,
          gatewayPayAmount,
          balance,
          folders,
          data,
          res
        )
      }
    }

    return await users.createOrder(
      userId,
      totalPrice + postageFee - discountAmount,
      0,
      folders,
      data,
      res
    )
  } catch (e) {
    console.log(e)
    return httpError(e || String(e) || e?.message, res)
  }
}

const priceCalculator = async (req, res) => {
  try {
    const userId = req?.user[0]?.id
    const { discountCode } = req.body
    let discount = null
    if (discountCode === '')
      return httpError(errorTypes.DISCOUNT_CODE_NOT_FOUND, res)
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
    for (const entity of folders) {
      amounts.push(entity?.amount)
      amount += entity?.amount
    }

    const data = {
      discountAmount:
        discount !== null
          ? await discounts.calculator(discount?.data, amount)
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

    const newWhere = {
      ...where,
      userId,
      status: { [Op.not]: 'payment_pending' }
    }

    const r = await orders.Get({
      where: newWhere,
      order: [['id', 'desc']],
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
          'referralId',
          'marketerBenefit',
          'referralBenefit',
          'referralCommission'
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
          },
          include: {
            model: sequelize.models.files,
            attributes: {
              exclude: ['userId', 'folder_files']
            },
            through: {
              attributes: {
                exclude: [
                  'userId',
                  'createdAt',
                  'updatedAt',
                  'fileId',
                  'folderId'
                ]
              }
            }
          }
        }
      ]
    })
    .then((r) => {
      const folders = r?.folders.map((item) => {
        if (item?.binding !== null) {
          item.binding =
            process.env.RUN_ENVIRONMENT === 'local'
              ? JSON.parse(JSON.parse(item?.binding))
              : JSON.parse(item?.binding)
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
      return httpError(e, res)
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
        balanceAfter:
          userWallet?.data?.balance + order?.amount + order?.postageFee,
        status: 'successful',
        amount: order?.amount + order?.postageFee,
        description: 'بازگشت وجه به کیف پول بابت لغو سفارش'
      },
      { transaction: t }
    )

    const user = await sequelize.models.users.findOne({
      where: {
        id: userId
      }
    })

    await user.update(
      {
        balance: userWallet?.data?.balance + order?.amount + order?.postageFee
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
