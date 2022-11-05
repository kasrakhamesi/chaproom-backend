const { sequelize } = require('../../models')
const { restful, filters, utils } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
const users = new restful(sequelize.models.users)
const _ = require('lodash')
const jexcel = require('json2excel')

const getAll = async (req, res, paginateActive = true) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.users
    )

    let r = await users.Get({
      attributes: [
        'id',
        'name',
        'phoneNumber',
        'balance',
        'marketingBalance',
        'createdAt'
      ],
      where,
      order,
      pagination: {
        active: paginateActive,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return httpError(e, res)

    if (r?.data?.users !== [] && !_.isEmpty(r?.data?.users)) {
      r.data.users = r?.data?.users.map((item) => {
        return {
          ...item.dataValues,
          walletBalance: item.balance - item.marketingBalance
        }
      })

      r.data.users = await Promise.all(r.data.users)
    }

    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    let data = []

    const totalUsersCount = await sequelize.models.users.count()

    const totalOrdersCount = await sequelize.models.orders.count({
      where: {
        status: { [Op.not]: 'payment_pending' }
      }
    })

    for (const entity of r?.data?.users || r?.data) {
      const countOfOrders = await sequelize.models.orders.count({
        where: {
          userId: entity?.id,
          status: { [Op.not]: 'payment_pending' }
        }
      })

      const userTransactions = await sequelize.models.transactions.findAll({
        where: {
          userId: entity?.id,
          status: 'successful',
          adminId: null
        }
      })

      const lastOrder = await sequelize.models.orders.findAll({
        limit: 1,
        where: {
          userId: entity?.id,
          status: { [Op.not]: 'payment_pending' }
        },
        order: [['createdAt', 'ASC']]
      })

      const firstOrder = await sequelize.models.orders.findAll({
        limit: 1,
        where: {
          userId: entity?.id,
          status: { [Op.not]: 'payment_pending' }
        },
        order: [['createdAt', 'DESC']]
      })

      let incoming = 0

      for (const transaction of userTransactions) {
        if (transaction?.change === 'increase')
          incoming += parseInt(transaction?.amount)
      }

      const newStyleEntity = _.isEmpty({ ...entity.dataValues })
        ? { ...entity }
        : { ...entity.dataValues }

      data.push({
        ...newStyleEntity,
        countOfOrders,
        totalPaidAmount: incoming,
        firstOrderAt: firstOrder[0]?.createdAt || null,
        lastOrderAt: lastOrder[0]?.createdAt || null
      })
    }

    data = await Promise.all(data)

    return {
      isSuccess: true,
      data: {
        statusCode: 200,
        data: {
          page: r?.data?.page,
          pageSize: r?.data?.pageSize,
          totalCount: r?.data?.totalCount,
          totalPageLeft: r?.data?.totalPageLeft,
          totalCountLeft: r?.data?.totalCountLeft,
          totalUsersCount,
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
