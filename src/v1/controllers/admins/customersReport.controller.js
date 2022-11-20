const { sequelize } = require('../../models')
const { restful, filters, utils } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
const users = new restful(sequelize.models.users)
const _ = require('lodash')
const jexcel = require('json2excel')

const SORT_ORDER = [
  'without_order',
  'one_order',
  'two_order',
  'three_and_more_order',
  'most_to_lowest_order',
  'lowest_to_most_order',
  'most_to_lowest_balance',
  'lowest_to_most_balance',
  'most_to_lowest_payment',
  'lowest_to_most_payment'
]

const getUsersIdByFilter = async (query) => {
  try {
    const { paperSize, paperSide, paperColor } = query

    const usersId = []

    if (!paperSide && !paperSide && !paperColor) {
      const users = await sequelize.models.users.findAll()
      for (const user of users) {
        usersId.push({
          id: user?.id
        })
      }
      return usersId
    }

    const where = { used: true }
    if (paperSize) where.size = paperSize
    if (paperSide) where.side = paperSide
    if (paperColor) where.color = paperColor

    const folders = await sequelize.models.folders.findAll({ where })
    for (const folder of folders) usersId.push({ id: folder?.userId })

    return usersId
  } catch {
    return []
  }
}

const reportStructure = async (users) => {
  try {
    const data = []

    const totalOrdersCount = 0
    /*
    await sequelize.models.orders.count({
      where: {
        status: { [Op.not]: 'payment_pending' }
      }
    })
    */

    for (const user of users?.data?.users) {
      const countOfOrders = await sequelize.models.orders.count({
        where: {
          userId: user?.id,
          status: { [Op.not]: 'payment_pending' }
        }
      })

      const userTransactions = await sequelize.models.transactions.findAll({
        where: {
          userId: user?.id,
          status: 'successful',
          adminId: null
        }
      })

      const lastOrder = await sequelize.models.orders.findAll({
        limit: 1,
        where: {
          userId: user?.id,
          status: { [Op.not]: 'payment_pending' }
        },
        order: [['createdAt', 'ASC']]
      })

      const firstOrder = await sequelize.models.orders.findAll({
        limit: 1,
        where: {
          userId: user?.id,
          status: { [Op.not]: 'payment_pending' }
        },
        order: [['createdAt', 'DESC']]
      })

      let incoming = 0

      for (const transaction of userTransactions) {
        if (transaction?.change === 'increase')
          incoming += parseInt(transaction?.amount)
      }

      const newStyleUser = _.isEmpty({ ...user.dataValues })
        ? { ...user }
        : { ...user.dataValues }

      data.push({
        ...newStyleUser,
        countOfOrders,
        totalPaidAmount: incoming,
        firstOrderAt: firstOrder[0]?.createdAt || null,
        lastOrderAt: lastOrder[0]?.createdAt || null
      })
    }

    //data = await Promise.all(data)

    return {
      isSuccess: true,
      data: {
        statusCode: 200,
        data: {
          page: users?.data?.page,
          pageSize: users?.data?.pageSize,
          totalCount: users?.data?.totalCount,
          totalPageLeft: users?.data?.totalPageLeft,
          totalCountLeft: users?.data?.totalCountLeft,
          totalUsersCount: users.data?.users.length,
          totalOrdersCount,
          totalDebtor: 5000,
          totalCreditor: 6000,
          customersReport: data
        },
        error: null
      }
    }
  } catch (e) {
    return {
      isSuccess: false,
      message:
        e ||
        e.message ||
        'مشکلی در سیستم پیش آمده.لطفا با مدیر ارتباط حاصل فرمایید'
    }
  }
}

const createSortOrder = async (query, inputUsersId, paginateActive = true) => {
  try {
    const { page, pageSize, sortOrder } = query
    const [order, where] = await filters.filter(query, sequelize.models.users)

    const usersId = []
    if (sortOrder === 'without_order') {
      for (const user of inputUsersId) {
        const order = await sequelize.models.orders.count({
          where: {
            userId: user?.id,
            status: { [Op.not]: 'canceled' },
            status: { [Op.not]: 'payment_pending' }
          }
        })
        if (order === 0) usersId.push({ id: user?.id })
      }

      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r)
      return reportData
    } else if (sortOrder === 'one_order') {
      for (const user of inputUsersId) {
        const order = await sequelize.models.orders.count({
          where: {
            userId: user?.id,
            status: { [Op.not]: 'canceled' },
            status: { [Op.not]: 'payment_pending' }
          }
        })
        if (order === 1) usersId.push({ id: user?.id })
      }

      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r)
      return reportData
    } else if (sortOrder === 'two_order') {
      for (const user of inputUsersId) {
        const order = await sequelize.models.orders.count({
          where: {
            userId: user?.id,
            status: { [Op.not]: 'canceled' },
            status: { [Op.not]: 'payment_pending' }
          }
        })
        if (order === 2) usersId.push({ id: user?.id })
      }

      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r)
      return reportData
    } else if (sortOrder === 'three_and_more_order') {
      for (const user of inputUsersId) {
        const order = await sequelize.models.orders.count({
          where: {
            userId: user?.id,
            status: { [Op.not]: 'canceled' },
            status: { [Op.not]: 'payment_pending' }
          }
        })
        if (order > 2) usersId.push({ id: user?.id })
      }

      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r)
      return reportData
    } else if (sortOrder === 'most_to_lowest_order') {
      for (const user of inputUsersId) {
        const order = await sequelize.models.orders.count({
          where: {
            userId: user?.id,
            status: { [Op.not]: 'canceled' },
            status: { [Op.not]: 'payment_pending' }
          }
        })
        usersId.push({ id: user?.id, countOfOrders: order })
      }
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
        const reportData = await reportStructure(r)
        return reportData
      }
    } else if (sortOrder === 'lowest_to_most_order') {
      for (const user of inputUsersId) {
        const order = await sequelize.models.orders.count({
          where: {
            userId: user?.id,
            status: { [Op.not]: 'canceled' },
            status: { [Op.not]: 'payment_pending' }
          }
        })
        usersId.push({ id: user?.id, countOfOrders: order })
      }
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
        const reportData = await reportStructure(r)
        return reportData
      }
    } else if (sortOrder === 'most_to_lowest_balance') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['balance', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r)
      return reportData
    } else if (sortOrder === 'lowest_to_most_balance') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.or]: usersId },
        order: [['balance', 'asc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: item.balance - item.marketingBalance
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r)
      return reportData
    } else if (sortOrder === 'most_to_lowest_payment') {
      const transactions = await sequelize.models.transactions.findAll({
        where: {
          status: 'successful',
          [Op.or]: inputUsersId
        }
      })
    } else if (sortOrder === 'lowest_to_most_payment') {
      const transactions = await sequelize.models.transactions.findAll({
        where: {
          status: 'successful',
          [Op.or]: inputUsersId
        }
      })
    }
    return usersId
  } catch (e) {
    console.log(e)
    return null
  }
}

const getAll = async (req, res, paginateActive = true) => {
  try {
    const filteredUsers = await getUsersIdByFilter(req.query)

    const filteredSortOrder = await createSortOrder(req.query, filteredUsers)

    console.log(filteredSortOrder)

    return filteredSortOrder
  } catch (e) {
    return {
      isSuccess: false,
      message:
        e ||
        e.message ||
        'مشکلی در سیستم پیش آمده.لطفا با مدیر ارتباط حاصل فرمایید'
    }
  }
}

const findAll = async (req, res) => {
  try {
    const r = await getAll(req, res)
    if (r.isSuccess) return res.status(r?.data?.statusCode).send(r?.data)
    return httpError(
      r?.message || 'مشکلی در سیستم پیش آمده.لطفا با مدیر ارتباط حاصل فرمایید',
      res
    )
  } catch (e) {
    return httpError(e, res)
  }
}

const createExcel = (req, res) => {
  return getAll(req, res, false)
    .then((r) => {
      if (r?.isSuccess) {
        const exc = {
          sheets: [
            {
              header: {
                id: 'شمارنده',
                name: 'نام و نام خانوادگی',
                phoneNumber: 'شماره تماس',
                balance: 'موجودی کامل',
                marketingBalance: 'موجودی بازاریابی',
                createdAt: 'تاریخ ساخت حساب',
                walletBalance: 'موجودی کیف پول',
                countOfOrders: 'تعداد سفارشات',
                totalPaidAmount: 'کل مبلغ پرداختی',
                firstOrderAt: 'تاریخ ثبت اولین سفارش',
                lastOrderAt: 'تاریخ ثبت اخرین سفارش'
              },
              items: r?.data?.data?.customersReport,
              sheetName: 'sheet1'
            }
          ],
          filepath: `chaproom-report_${Date.now()}.xlsx`
        }

        return jexcel.j2e(exc, (err) => {
          if (err)
            return httpError(
              'مشکلی در سیستم پیش آمده.لطفا با مدیر ارتباط حاصل فرمایید',
              res
            )
          return res.status(201).send({
            statusCode: 201,
            data: {
              url: 'https://google.com'
            },
            error: null
          })
        })
      }
      return httpError(
        r?.message ||
          'مشکلی در سیستم پیش آمده.لطفا با مدیر ارتباط حاصل فرمایید',
        res
      )
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findAll, createExcel }
