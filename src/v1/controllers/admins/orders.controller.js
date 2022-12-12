const { sequelize } = require('../../models')
const { restful, filters, users } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const { Op } = require('sequelize')
const orders = new restful(sequelize.models.orders)
const _ = require('lodash')

const globalFindAll = async (req, res) => {
  try {
    const { page, pageSize, search } = req.query

    const where = []

    if (
      String(search).length > 0 &&
      !isNaN(parseInt(search)) &&
      String(search)[0] !== '0'
    )
      where.push({ id: { [Op.like]: `${search}%` } })
    else
      where.push(
        {
          '$user.name$': {
            [Op.like]: `%${search}%`
          }
        },
        {
          '$user.phoneNumber$': {
            [Op.like]: `%${search}%`
          }
        }
      )

    const newWhere = {
      [Op.or]: where,
      status: { [Op.not]: 'payment_pending' }
    }

    const r = await orders.Get({
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
      include: {
        model: sequelize.models.users,
        attributes: ['id', 'name', 'phoneNumber']
      },
      where: newWhere,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    res.status(r?.statusCode).send({
      statusCode: 200,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        orders: _.isEmpty(r?.data?.orders)
          ? []
          : r?.data?.orders.map((item) => {
              return {
                ...item.dataValues,
                trackingUrl: null
              }
            })
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findAllByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.orders
    )

    const user = await sequelize.models.users.findOne({
      attributes: ['id', 'name', 'phoneNumber'],
      where: {
        id: userId
      }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const newWhere = {
      ...where,
      status: { [Op.not]: 'payment_pending' },
      userId
    }

    const r = await orders.Get({
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
          'referralCommission',
          'amount'
        ]
      },
      include: {
        model: sequelize.models.users,
        attributes: ['id', 'name', 'phoneNumber']
      },
      where: newWhere,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    res.status(r?.statusCode).send({
      statusCode: 200,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        user,
        orders: _.isEmpty(r?.data?.orders)
          ? []
          : r?.data?.orders.map((item) => {
              return {
                ...item.dataValues,
                amount: item.walletPaidAmount + item.gatewayPaidAmount,
                trackingUrl: null
              }
            })
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.orders
    )

    const newWhere = {
      ...where,
      status: { [Op.not]: 'payment_pending' }
    }

    const r = await orders.Get({
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
      include: {
        model: sequelize.models.users,
        attributes: ['id', 'name', 'phoneNumber']
      },
      where: newWhere,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    res.status(r?.statusCode).send({
      statusCode: 200,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        orders: _.isEmpty(r?.data?.orders)
          ? []
          : r?.data?.orders.map((item) => {
              return {
                ...item.dataValues,
                amount: item.walletPaidAmount + item.gatewayPaidAmount,
                trackingUrl: null
              }
            })
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findOne = (req, res) => {
  const { id } = req.params
  return sequelize.models.orders
    .findOne({
      where: {
        id
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
          model: sequelize.models.users,
          attributes: ['id', 'name', 'phoneNumber']
        },
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
    const { id } = req.params
    const { status, trackingNumber, cancelReason } = req.body

    const data = {
      status,
      trackingNumber,
      cancelReason,
      postageMethod: 'پست پیشتاز'
    }

    if (status !== 'preparing' && status !== 'sent' && status !== 'canceled')
      return httpError(errorTypes.INVALID_ORDER_STATUS, res)

    const order = await sequelize.models.orders.findOne({
      where: {
        id,
        status: { [Op.not]: 'sent' },
        status: { [Op.not]: 'canceled' },
        status: { [Op.not]: 'payment_pending' }
      }
    })

    if (!order) return httpError(errorTypes.ORDER_NOT_FOUND, res)

    const t = await sequelize.transaction()

    await order.update(data, { transaction: t })

    const user = await sequelize.models.users.findOne({
      where: {
        id: order?.userId
      }
    })

    if (status === 'canceled') {
      const userWallet = await users.getBalance(user?.id)

      if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

      await sequelize.models.transactions.create(
        {
          userId: user?.id,
          orderId: id,
          type: 'deposit',
          change: 'increase',
          status: 'successful',
          amount: order?.gatewayPaidAmount + order?.walletPaidAmount,
          description: 'بازگشت وجه به کیف پول بابت لغو سفارش'
        },
        { transaction: t }
      )

      const findedUser = await sequelize.models.users.findOne({
        where: {
          id: user?.id
        }
      })

      await findedUser.update(
        {
          balance:
            userWallet?.data?.balance +
            order?.gatewayPaidAmount +
            order?.walletPaidAmount
        },
        { transaction: t }
      )
    } else if (status === 'sent') {
      await user.update(
        {
          countOfOrders: user?.countOfOrders + 1
        },
        { transaction: t }
      )

      if (order?.discountId && typeof order?.discountId === 'number') {
        const discount = await sequelize.models.discounts.findOne({
          where: {
            id: order?.discountId
          }
        })

        if (discount?.userMarketing) {
          await discount.update(
            {
              timesUsed: discount?.timesUsed + 1,
              totalSale: order?.amount + discount?.totalSale,
              benefit: discount?.benefit + order?.discountBenefit
            },
            { transaction: t }
          )

          const ownerOfDiscount = await sequelize.models.users.findOne({
            where: {
              id: discount?.userId
            }
          })

          const ownerOfDiscountWallet = await users.getBalance(
            ownerOfDiscount?.id
          )

          if (!ownerOfDiscountWallet?.isSuccess)
            return httpError(ownerOfDiscountWallet?.message, res)

          await sequelize.models.transactions.create(
            {
              userId: ownerOfDiscount?.id,
              type: 'marketing_discount',
              change: 'increase',
              status: 'successful',
              amount: order?.discountBenefit,
              description: 'افزایش موجودی بابت بازاریابی کد تخفیف'
            },
            { transaction: t }
          )
          await ownerOfDiscount.update(
            {
              marketingBalance:
                ownerOfDiscountWallet?.data?.marketingBalance +
                order?.discountBenefit
            },
            {
              transaction: t
            }
          )
        } else {
          await discount.update(
            {
              timesUsed: discount?.timesUsed + 1,
              totalSale: order?.amount + discount?.totalSale
            },
            { transaction: t }
          )
        }
      }

      if (order?.referralId && typeof order?.referralId === 'number') {
        const referral = await sequelize.models.referrals.findOne({
          where: {
            id: order?.referralId
          }
        })
        await referral.update(
          {
            sellCount: referral?.sellCount + 1,
            totalSale: order?.amount + referral?.totalSale,
            benefit: order?.referralBenefit + referral?.benefit
          },
          { transaction: t }
        )

        const ownerOfReferral = await sequelize.models.users.findOne({
          where: {
            id: referral?.referralUserId
          }
        })

        const ownerOfReferralWallet = await users.getBalance(
          ownerOfReferral?.id
        )

        if (!ownerOfReferralWallet?.isSuccess)
          return httpError(ownerOfReferralWallet?.message, res)

        await sequelize.models.transactions.create(
          {
            userId: ownerOfReferral?.id,
            type: 'marketing_referral',
            change: 'increase',
            status: 'successful',
            amount: order?.referralBenefit,
            description: 'افزایش موجودی بابت بازاریابی لینک'
          },
          { transaction: t }
        )
        await ownerOfReferral.update(
          {
            marketingBalance:
              ownerOfReferralWallet?.data?.marketingBalance +
              order?.referralBenefit
          },
          {
            transaction: t
          }
        )
      }
    }
    await t.commit()

    const findCurrentOrder = await sequelize.models.orders.findOne({
      where: {
        id
      }
    })

    await findCurrentOrder.update({ sentAt: findCurrentOrder?.updatedAt })

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

module.exports = { findAll, findOne, update, findAllByUserId, globalFindAll }
