const { sequelize } = require('../../models')
const { restful, filters, uniqueGenerates, utils } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const users = new restful(sequelize.models.users)
const _ = require('lodash')
const { authorize } = require('../../middlewares')
const { Op } = require('sequelize')

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.users
    )

    let r = await users.Get({
      attributes: ['id', 'name', 'phoneNumber', 'balance', 'marketingBalance'],
      where,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return httpError(r?.error?.message, res)

    if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
      r.data.users = r?.data?.users.map((item) => {
        return {
          ...item.dataValues,
          walletBalance: Math.max(0, item.balance - item.marketingBalance)
        }
      })

      r.data.users = await Promise.all(r.data.users)
    }

    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    let data = []

    for (const entity of r?.data?.users) {
      const countOfOrders = await sequelize.models.orders.count({
        where: {
          userId: entity?.id,
          status: { [Op.not]: 'payment_pending' }
        }
      })
      data.push({ ...entity, countOfOrders })
    }

    data = await Promise.all(data)

    res.status(200).send({
      statusCode: 200,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        users: data
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findOne = (req, res) => {
  const { id } = req.params
  return sequelize.models.users
    .findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['password']
      }
    })
    .then((r) => {
      if (!r) return httpError(errorTypes.USER_NOT_FOUND, res)
      res.status(200).send({
        statusCode: 200,
        data: {
          id: r.id,
          name: r.name,
          phoneNumber: r.phoneNumber,
          walletBalance: Math.max(0, r?.balance - r?.marketingBalance)
        },
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const create = async (req, res) => {
  try {
    const { name, phoneNumber, password, walletBalance } = req.body
    const data = {
      name,
      phoneNumber,
      password,
      balance: walletBalance
    }

    const user = await sequelize.models.users.findOne({
      where: {
        phoneNumber
      }
    })

    if (user) return httpError(errorTypes.USER_EXIST_ERROR, res)

    const t = await sequelize.transaction()

    const r = await sequelize.models.users.create(data, { transaction: t })

    if (!r) return httpError(errorTypes.USER_EXIST_ERROR)

    const discountCodes = await uniqueGenerates.discountCode(2)

    await sequelize.models.discounts.create(
      {
        userId: r?.id,
        value: '5',
        type: 'percentage',
        code: discountCodes[0],
        usageLimit: null,
        userMarketing: true
      },
      { transaction: t }
    )
    await sequelize.models.discounts.create(
      {
        userId: r?.id,
        value: '10',
        type: 'percentage',
        code: discountCodes[1],
        usageLimit: null,
        userMarketing: true
      },
      { transaction: t }
    )

    await sequelize.models.referrals.create(
      {
        userId: r?.id,
        referralUserId: null,
        slug: `ref=${r?.id}`
      },
      { transaction: t }
    )

    if (walletBalance && walletBalance !== 0) {
      await sequelize.models.transactions.create(
        {
          userId: r?.id,
          adminId: req?.user[0]?.id,
          type: 'deposit',
          change: 'increase',
          balance: 0,
          balanceAfter: walletBalance,
          status: 'successful',
          amount: walletBalance,
          description: '???????????? ???????????? ?????? ?????? ???????? ??????????'
        },
        { transaction: t }
      )
    }

    await t.commit()

    return res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phoneNumber, password, walletBalance } = req.body
    const data = {
      name,
      phoneNumber
    }

    if (
      password &&
      password !== null &&
      password !== '' &&
      password !== undefined
    )
      data.password = password

    const user = await sequelize.models.users.findOne({
      where: {
        id
      }
    })
    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const checkNewPhoneNumber = await sequelize.models.users.findOne({
      where: {
        id: { [Op.not]: id },
        phoneNumber
      }
    })

    if (checkNewPhoneNumber) return httpError(errorTypes.USER_EXIST_ERROR, res)

    const t = await sequelize.transaction()

    data.balance = walletBalance + user?.marketingBalance

    const currentWalletBalance = Math.max(
      0,
      user?.balance - user?.marketingBalance
    )

    if (walletBalance && walletBalance !== currentWalletBalance) {
      await sequelize.models.transactions.create(
        {
          userId: user?.id,
          adminId: req?.user[0]?.id,
          type: walletBalance > currentWalletBalance ? 'deposit' : 'withdrawal',
          change:
            walletBalance > currentWalletBalance ? 'increase' : 'decrease',
          balance: user?.balance,
          balanceAfter: walletBalance + user?.marketingBalance,
          status: 'successful',
          amount: Math.abs(walletBalance - currentWalletBalance),
          description:
            walletBalance > currentWalletBalance
              ? '???????????? ???????????? ?????? ?????? ???????? ??????????'
              : '???????? ???????????? ?????? ?????? ???????? ??????????'
        },
        { transaction: t }
      )
    }

    await user.update(data, { transaction: t })

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    return httpError(e, res)
  }
}

const softDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await users.Delete({ req, where: { id } })
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const generateAccessToken = async (req, res) => {
  try {
    const { id } = req.params
    const user = await sequelize.models.users.findOne({
      where: {
        id
      }
    })
    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)
    const accessToken = authorize.generateUserJwt(user?.id, user?.phoneNumber)
    res.status(201).send({
      statusCode: 201,
      data: {
        userToken: {
          access: accessToken,
          expireAt: utils.timestampToIso(
            authorize.decodeJwt(accessToken, false).exp
          )
        }
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const marketing = async (req, res) => {
  try {
    const { id } = req.params

    const user = await sequelize.models.users.findOne({
      where: {
        id
      },
      attributes: ['id', 'name', 'phoneNumber']
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const discounts = await sequelize.models.discounts.findAll({
      where: {
        userId: id,
        userMarketing: true
      }
    })

    let totalSales = 0
    let benefit = 0
    let timesUsed = 0

    for (const entity of discounts) {
      timesUsed += entity?.timesUsed
      totalSales += entity?.totalSale
      benefit += entity?.benefit
    }

    const referral = await sequelize.models.referrals.findOne({
      where: {
        userId: id
      },
      attributes: {
        exclude: ['id', 'userId', 'referralUserId']
      }
    })

    const r = {
      user,
      discount: { totalSales, benefit, timesUsed, data: discounts },
      referral
    }

    res.status(200).send({
      statusCode: 200,
      data: r,
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = {
  findAll,
  findOne,
  create,
  update,
  softDelete,
  generateAccessToken,
  marketing
}
