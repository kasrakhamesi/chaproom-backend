const { sequelize } = require('../../models')
const { restful, filters, utils } = require('../../libs')
const { httpError } = require('../../configs')
const { Op } = require('sequelize')
const _ = require('lodash')
const jexcel = require('json2excel')
const users = new restful(sequelize.models.users)
const libs = require('../../libs')

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

const reportStructure = async (users, allUsers) => {
  try {
    const data = []

    const usersId = []
    for (const user of allUsers?.data) {
      usersId.push({
        userId: user?.id
      })
    }

    const totalOrdersCount = _.isEmpty(usersId)
      ? 0
      : await sequelize.models.orders.count({
          where: {
            [Op.and]: usersId,
            status: { [Op.not]: 'payment_pending' }
          }
        })

    let totalDebtor = 0
    let totalCreditor = 0

    const allUsersTransactions = _.isEmpty(usersId)
      ? []
      : await sequelize.models.transactions.findAll({
          where: {
            [Op.and]: usersId,
            status: 'successful',
            description: { [Op.not]: 'increase_for_order' }
          }
        })

    for (const transaction of allUsersTransactions) {
      const transactionInfo = await libs.users.getTransactionTypeAndAmount(
        transaction
      )
      if (transactionInfo.type === 'بستانکار')
        totalCreditor += transactionInfo?.amount
      else if (transactionInfo.type === 'بدهکار')
        totalDebtor += transactionInfo?.amount
    }

    const usersData = _.isEmpty(users?.data?.users)
      ? users?.data
      : users?.data?.users

    if (!usersData.hasOwnProperty('users'))
      for (const user of usersData) {
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
            description: { [Op.not]: 'increase_for_order' }
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
          const transactionInfo = await libs.users.getTransactionTypeAndAmount(
            transaction
          )
          if (transactionInfo.type === 'بستانکار')
            incoming += transactionInfo?.amount
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

    const newData = []
    const isFoundWalletBalance = data.some((item) => {
      try {
        if (item.walletBalance) {
          return true
        }
        return false
      } catch {
        return false
      }
    })

    if (!isFoundWalletBalance) {
      for (const entity of data) {
        newData.push({
          ...entity,
          walletBalance: Math.max(0, entity.balance - entity.marketingBalance)
        })
      }
    }

    return {
      isSuccess: true,
      data: {
        statusCode: 200,
        data: {
          page: users?.data?.page || 0,
          pageSize: users?.data?.pageSize || Number.MAX_VALUE,
          totalCount: users?.data?.totalCount || users?.data?.length || 0,
          totalPageLeft: users?.data?.totalPageLeft || 0,
          totalCountLeft: users?.data?.totalCountLeft || 0,
          totalUsersCount: allUsers?.data?.length || 0,
          totalOrdersCount,
          totalDebtor,
          totalCreditor,
          customersReport: _.isEmpty(newData) ? data : newData
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
    if (_.isEmpty(inputUsersId))
      return {
        isSuccess: true,
        data: {
          statusCode: 200,
          data: {
            page: 1,
            pageSize: 5,
            totalCount: 0,
            totalPageLeft: 0,
            totalCountLeft: 0,
            totalUsersCount: 0,
            totalOrdersCount: 0,
            totalDebtor: 0,
            totalCreditor: 0,
            customersReport: []
          },
          error: null
        }
      }

    const { page, pageSize, sortOrder } = query
    const [order, where] = await filters.filter(query, sequelize.models.users)

    if (sortOrder === 'without_order') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.and]: inputUsersId, countOfOrders: 0 },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.and]: inputUsersId, countOfOrders: 0 },
        order: [['id', 'desc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    } else if (sortOrder === 'one_order') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.and]: inputUsersId, countOfOrders: 1 },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.and]: inputUsersId, countOfOrders: 1 },
        order: [['id', 'desc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    } else if (sortOrder === 'two_order') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.and]: inputUsersId, countOfOrders: 2 },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: { ...where, [Op.and]: inputUsersId, countOfOrders: 2 },
        order: [['id', 'desc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    } else if (sortOrder === 'three_and_more_order') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId,
          countOfOrders: { [Op.gte]: 3 }
        },
        order: [['id', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId,
          countOfOrders: { [Op.gte]: 3 }
        },
        order: [['id', 'desc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    } else if (sortOrder === 'most_to_lowest_order') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['countOfOrders', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['countOfOrders', 'desc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    } else if (sortOrder === 'lowest_to_most_order') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['countOfOrders', 'asc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['countOfOrders', 'asc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
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
        where: { ...where },
        order: [['balance', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['balance', 'asc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
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
        where: { ...where },
        order: [['balance', 'asc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['balance', 'asc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    } else if (sortOrder === 'most_to_lowest_payment') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['incomingPayment', 'desc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['incomingPayment', 'desc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    } else if (sortOrder === 'lowest_to_most_payment') {
      let r = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['incomingPayment', 'asc']],
        pagination: {
          active: paginateActive,
          page,
          pageSize
        }
      })

      const allUsers = await users.Get({
        attributes: [
          'id',
          'name',
          'phoneNumber',
          'balance',
          'marketingBalance',
          'createdAt'
        ],
        where: {
          ...where,
          [Op.and]: inputUsersId
        },
        order: [['incomingPayment', 'asc']]
      })

      if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

      if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
        r.data.users = r?.data?.users.map((item) => {
          return {
            ...item.dataValues,
            walletBalance: Math.max(0, item.balance - item.marketingBalance)
          }
        })

        r.data.users = await Promise.all(r.data.users)
      }
      const reportData = await reportStructure(r, allUsers)
      return reportData
    }
    return null
  } catch {
    return null
  }
}

const getAll = async (req, res, paginateActive = true) => {
  try {
    const filteredUsers = await getUsersIdByFilter(req.query)

    const filteredSortOrder = await createSortOrder(
      req.query,
      filteredUsers,
      paginateActive
    )

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
    if (r?.isSuccess) return res.status(r?.data?.statusCode).send(r?.data)
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
      const now = Date.now()
      if (r?.isSuccess) {
        const data = []
        for (const entity of r?.data?.data?.customersReport) {
          data.push({
            id: entity?.id,
            name: entity?.name,
            phoneNumber: entity?.phoneNumber,
            balance: entity?.balance,
            marketingBalance: entity?.marketingBalance,
            createdAt: _.isEmpty(entity.createdAt)
              ? 'ندارد'
              : new utils.PersianDate(entity.createdAt).getPartsWithBackSlash(),
            walletBalance: Math.max(0, entity?.walletBalance),
            countOfOrders: entity?.countOfOrders,
            totalPaidAmount: entity?.totalPaidAmount,
            firstOrderAt: _.isEmpty(entity.firstOrderAt)
              ? 'ندارد'
              : new utils.PersianDate(
                  entity.firstOrderAt
                ).getPartsWithBackSlash(),
            lastOrderAt: _.isEmpty(entity.lastOrderAt)
              ? 'ندارد'
              : new utils.PersianDate(
                  entity.lastOrderAt
                ).getPartsWithBackSlash()
          })
        }
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
              items: data,
              sheetName: 'sheet1'
            }
          ],
          filepath: `${__dirname
            .replace('controllers', 'storages')
            .replace('admins', 'excels')}/chaproom-report_${now}.xlsx`
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
              url: `${process.env.BACKEND_DOMAIN}/v1/admins/outputs/excels/chaproom-report_${now}.xlsx`
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
