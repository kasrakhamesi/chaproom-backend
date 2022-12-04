const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { utils, users } = require('../../libs')
const { Op } = require('sequelize')
const _ = require('lodash')

const getUsers = async () => {
  try {
    const ticker = 'daily'

    const users = await sequelize.models.users.findAndCountAll({
      attributes: ['createdAt'],
      order: [['id', 'desc']]
    })

    const timeList = utils.createTimeList(ticker)

    for (const user of users.rows) {
      const createdAt = new utils.PersianDate(user.createdAt)

      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      }
    }

    return { totalUsers: users.count, chart: timeList }
  } catch {
    return null
  }
}

const findUsers = async (req, res) => {
  try {
    let { ticker } = req.params

    ticker = String(ticker).toLowerCase()

    if (ticker !== 'daily' && ticker !== 'weekly' && ticker !== 'monthly')
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    const users = await sequelize.models.users.findAndCountAll({
      attributes: ['createdAt'],
      order: [['id', 'desc']]
    })

    const timeList = utils.createTimeList(ticker)

    for (const user of users.rows) {
      const createdAt = new utils.PersianDate(user.createdAt)

      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      } else if (ticker === 'weekly') {
        const newStyleCreatedAt =
          String(createdAt.getDate()).length === 1
            ? `0${String(createdAt.getDate())}`
            : String(createdAt.getDate())

        const userCreatedAt = parseInt(
          `${createdAt.getMonth()}${newStyleCreatedAt}`
        )

        for (let k = 0; k < timeList.length; k++) {
          if (k + 1 === timeList.length) break

          const currentTimeList = parseInt(
            String(timeList[k].time).replace('/', '')
          )

          const previousTimeList = parseInt(
            String(timeList[k + 1].time).replace('/', '')
          )

          if (
            previousTimeList < userCreatedAt &&
            userCreatedAt >= currentTimeList
          ) {
            timeList[k].count++
            break
          }
        }
      } else if (ticker === 'monthly') {
        const userCreatedAt = utils.dateFormat(createdAt.getMonth())
        const findedCreatedAt = timeList.find(
          (item) => item.time === String(userCreatedAt)
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      }
    }

    res.status(200).send({
      statusCode: 200,
      data: { totalUsers: users.count, chart: timeList },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const getOrders = async () => {
  try {
    const ticker = 'daily'

    const orders = await sequelize.models.orders.findAndCountAll({
      attributes: ['createdAt'],
      order: [['id', 'desc']],
      where: {
        [Op.or]: [
          {
            status: 'preparing'
          },
          { status: 'sent' }
        ]
      }
    })

    const timeList = utils.createTimeList(ticker)

    for (const order of orders.rows) {
      const createdAt = new utils.PersianDate(order.createdAt)

      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      }
    }

    return { totalOrders: orders.count, chart: timeList }
  } catch (e) {
    return null
  }
}

const findOrders = async (req, res) => {
  try {
    let { ticker } = req.params

    ticker = String(ticker).toLowerCase()

    if (ticker !== 'daily' && ticker !== 'weekly' && ticker !== 'monthly')
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    const orders = await sequelize.models.orders.findAndCountAll({
      attributes: ['createdAt'],
      order: [['id', 'desc']],
      where: {
        [Op.or]: [
          {
            status: 'preparing'
          },
          { status: 'sent' }
        ]
      }
    })

    const timeList = utils.createTimeList(ticker)

    for (const order of orders.rows) {
      const createdAt = new utils.PersianDate(order.createdAt)

      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      } else if (ticker === 'weekly') {
        const newStyleCreatedAt =
          String(createdAt.getDate()).length === 1
            ? `0${String(createdAt.getDate())}`
            : String(createdAt.getDate())

        const userCreatedAt = parseInt(
          `${createdAt.getMonth()}${newStyleCreatedAt}`
        )

        for (let k = 0; k < timeList.length; k++) {
          if (k + 1 === timeList.length) break

          const currentTimeList = parseInt(
            String(timeList[k].time).replace('/', '')
          )

          const previousTimeList = parseInt(
            String(timeList[k + 1].time).replace('/', '')
          )

          if (
            previousTimeList < userCreatedAt &&
            userCreatedAt >= currentTimeList
          ) {
            timeList[k].count++
            break
          }
        }
      } else if (ticker === 'monthly') {
        const userCreatedAt = utils.dateFormat(createdAt.getMonth())
        const findedCreatedAt = timeList.find(
          (item) => item.time === String(userCreatedAt)
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      }
    }

    res.status(200).send({
      statusCode: 200,
      data: { totalOrders: orders.count, chart: timeList },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const getSales = async () => {
  try {
    const ticker = 'daily'

    const transactions = await sequelize.models.transactions.findAndCountAll({
      where: {
        status: 'successful',
        description: { [Op.not]: 'increase_for_order' }
      },
      attributes: [
        'id',
        'amount',
        'change',
        'createdAt',
        'type',
        'adminId',
        'orderId',
        'description'
      ],
      order: [['id', 'desc']]
    })

    const timeList = utils.createTimeList(ticker, true)

    for (const transaction of transactions.rows) {
      const createdAt = new utils.PersianDate(transaction.createdAt)
      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          const transactionInfo = await users.getTransactionTypeAndAmount(
            transaction
          )

          if (transactionInfo?.type === 'بدهکار')
            findedCreatedAt.debtor += transactionInfo?.amount
          else if (transactionInfo?.type === 'بستانکار')
            findedCreatedAt.creditor += transactionInfo?.amount
        }
      }
    }

    let totalSales = 0

    for (const transaction of transactions.rows) {
      const transactionInfo = await users.getTransactionTypeAndAmount(
        transaction
      )
      if (transactionInfo?.type === 'بستانکار')
        totalSales += parseInt(transaction?.amount)
    }

    return { totalSales, chart: timeList }
  } catch {
    return null
  }
}

const findSales = async (req, res) => {
  try {
    let { ticker } = req.params

    ticker = String(ticker).toLowerCase()

    if (ticker !== 'daily' && ticker !== 'weekly' && ticker !== 'monthly')
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    const transactions = await sequelize.models.transactions.findAndCountAll({
      where: {
        status: 'successful',
        description: { [Op.not]: 'increase_for_order' }
      },
      attributes: [
        'id',
        'amount',
        'change',
        'createdAt',
        'type',
        'adminId',
        'orderId'
      ],
      order: [['id', 'desc']]
    })

    const timeList = utils.createTimeList(ticker, true)

    for (const transaction of transactions.rows) {
      const createdAt = new utils.PersianDate(transaction.createdAt)

      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          const transactionInfo = await users.getTransactionTypeAndAmount(
            transaction
          )

          if (transactionInfo?.type === 'بدهکار')
            findedCreatedAt.debtor += transactionInfo?.amount
          else if (transactionInfo?.type === 'بستانکار')
            findedCreatedAt.creditor += transactionInfo?.amount
        }
      } else if (ticker === 'weekly') {
        const newStyleCreatedAt =
          String(createdAt.getDate()).length === 1
            ? `0${String(createdAt.getDate())}`
            : String(createdAt.getDate())

        const userCreatedAt = parseInt(
          `${createdAt.getMonth()}${newStyleCreatedAt}`
        )
        for (let k = 0; k < timeList.length; k++) {
          if (k + 1 === timeList.length) break

          const currentTimeList = parseInt(
            String(timeList[k].time).replace('/', '')
          )

          const previousTimeList = parseInt(
            String(timeList[k + 1].time).replace('/', '')
          )

          if (
            previousTimeList < userCreatedAt &&
            userCreatedAt >= currentTimeList
          ) {
            const transactionInfo = await users.getTransactionTypeAndAmount(
              transaction
            )

            if (transactionInfo?.type === 'بدهکار')
              timeList[k].debtor += transactionInfo?.amount
            else if (transactionInfo?.type === 'بستانکار')
              timeList[k].creditor += transactionInfo?.amount

            break
          }
        }
      } else if (ticker === 'monthly') {
        const userCreatedAt = utils.dateFormat(createdAt.getMonth())
        const findedCreatedAt = timeList.find(
          (item) => item.time === String(userCreatedAt)
        )
        if (findedCreatedAt) {
          const transactionInfo = await users.getTransactionTypeAndAmount(
            transaction
          )

          if (transactionInfo?.type === 'بدهکار')
            findedCreatedAt.debtor += transactionInfo?.amount
          else if (transactionInfo?.type === 'بستانکار')
            findedCreatedAt.creditor += transactionInfo?.amount
        }
      }
    }

    let totalSales = 0

    for (const transaction of transactions.rows) {
      const transactionInfo = await users.getTransactionTypeAndAmount(
        transaction
      )
      if (transactionInfo?.type === 'بستانکار')
        totalSales += parseInt(transaction?.amount)
    }

    res.status(200).send({
      statusCode: 200,
      data: { totalSales, chart: timeList },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findUserOrder = async (req, res) => {
  try {
    let { ticker } = req.params
    let { orders } = req.query

    ticker = String(ticker).toLowerCase()

    if (ticker !== 'daily' && ticker !== 'weekly' && ticker !== 'monthly')
      return httpError(errorTypes.TIMEFRAME_NOT_EXIST, res)

    if (orders !== 'one' && orders !== 'two' && orders !== 'three')
      return httpError(errorTypes.FILTER_NOT_EXIST, res)

    const findedOrders = await sequelize.models.orders.findAll({
      attributes: ['id', 'userId'],
      where: {
        [Op.or]: [
          {
            status: 'preparing'
          },
          { status: 'sent' }
        ]
      }
    })

    const ordersCount = {}
    const ordersData = []
    let totalUsersWithOneOrder = 0
    let totalUsersWithTwoOrder = 0
    let totalUsersWithThreeOrder = 0

    findedOrders.forEach((item) => {
      ordersCount[item?.userId] = (ordersCount[item?.userId] || 0) + 1
    })

    for (const entity in ordersCount) {
      if (ordersCount[entity] >= 1) {
        totalUsersWithOneOrder++
        if (orders === 'one') ordersData.push({ id: entity })
      } else if (ordersCount[entity] >= 2) {
        totalUsersWithTwoOrder++
        if (orders === 'two') ordersData.push({ id: entity })
      } else if (ordersCount[entity] >= 3) {
        totalUsersWithThreeOrder++
        if (orders === 'three') ordersData.push({ id: entity })
      }
    }

    const users = await sequelize.models.users.findAndCountAll({
      attributes: ['id', 'createdAt'],
      order: [['id', 'desc']],
      where: { [Op.or]: ordersData }
    })

    const timeList = utils.createTimeList(ticker)

    for (const user of users.rows) {
      const createdAt = new utils.PersianDate(user.createdAt)

      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      } else if (ticker === 'weekly') {
        const newStyleCreatedAt =
          String(createdAt.getDate()).length === 1
            ? `0${String(createdAt.getDate())}`
            : String(createdAt.getDate())

        const userCreatedAt = parseInt(
          `${createdAt.getMonth()}${newStyleCreatedAt}`
        )

        for (let k = 0; k < timeList.length; k++) {
          if (k + 1 === timeList.length) break

          const currentTimeList = parseInt(
            String(timeList[k].time).replace('/', '')
          )

          const previousTimeList = parseInt(
            String(timeList[k + 1].time).replace('/', '')
          )

          if (
            previousTimeList < userCreatedAt &&
            userCreatedAt >= currentTimeList
          ) {
            timeList[k].count++
            break
          }
        }
      } else if (ticker === 'monthly') {
        const userCreatedAt = utils.dateFormat(createdAt.getMonth())
        const findedCreatedAt = timeList.find(
          (item) => item.time === String(userCreatedAt)
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      }
    }

    res.status(200).send({
      statusCode: 200,
      data: {
        totalUsersWithOneOrder,
        totalUsersWithTwoOrder,
        totalUsersWithThreeOrder,
        chart: timeList
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const getOrdersOfProvinces = async () => {
  try {
    const provinces = utils.iranProvinces()
    const data = {}
    for (const province of provinces) {
      const orders = await sequelize.models.orders.findAndCountAll({
        attributes: [
          'id',
          'recipientDeliveryProvince',
          'amount',
          'walletPaidAmount',
          'gatewayPaidAmount'
        ],
        where: {
          recipientDeliveryProvince: province,
          [Op.or]: [
            {
              status: 'preparing'
            },
            { status: 'sent' }
          ]
        }
      })

      let amount = 0

      for (const order of orders?.rows) {
        amount += order?.walletPaidAmount + order?.gatewayPaidAmount
      }

      const addresses = await sequelize.models.addresses.findAll({
        attributes: ['id', 'userId', 'recipientDeliveryProvince'],
        where: { recipientDeliveryProvince: province }
      })

      if (_.isEmpty(addresses)) {
        data[province] = {
          sale: amount,
          totalOrders: orders.count,
          totalUsers: 0
        }
        continue
      }

      for (const address of addresses) {
        const users = await sequelize.models.users.count({
          where: { id: address?.userId }
        })
        data[province] = {
          sale: amount,
          totalOrders: orders.count,
          totalUsers: users
        }
      }
    }
    return {
      isSuccess: true,
      data
    }
  } catch (e) {
    return {
      isSuccess: false,
      message: e
    }
  }
}

const getUsersOrders = async () => {
  try {
    const ticker = 'daily'
    const orders = 'one'

    const findedOrders = await sequelize.models.orders.findAll({
      attributes: ['id', 'userId'],
      where: {
        [Op.or]: [
          {
            status: 'preparing'
          },
          { status: 'sent' }
        ]
      }
    })

    const ordersCount = {}
    const ordersData = []
    let totalUsersWithOneOrder = 0
    let totalUsersWithTwoOrder = 0
    let totalUsersWithThreeOrder = 0

    findedOrders.forEach((item) => {
      ordersCount[item?.userId] = (ordersCount[item?.userId] || 0) + 1
    })

    for (const entity in ordersCount) {
      if (ordersCount[entity] >= 1) {
        totalUsersWithOneOrder++
        if (orders === 'one') ordersData.push({ id: entity })
      } else if (ordersCount[entity] >= 2) {
        totalUsersWithTwoOrder++
        if (orders === 'two') ordersData.push({ id: entity })
      } else if (ordersCount[entity] >= 3) {
        totalUsersWithThreeOrder++
        if (orders === 'three') ordersData.push({ id: entity })
      }
    }

    const users = await sequelize.models.users.findAndCountAll({
      attributes: ['id', 'createdAt'],
      order: [['id', 'desc']],
      where: { [Op.or]: ordersData }
    })

    const timeList = utils.createTimeList(ticker)

    for (const order of users.rows) {
      const createdAt = new utils.PersianDate(order.createdAt)

      if (ticker === 'daily') {
        const userCreatedAt = `${utils.dateFormat(
          createdAt.getMonth()
        )}/${utils.dateFormat(createdAt.getDate())}`
        const findedCreatedAt = timeList.find(
          (item) => item.time === userCreatedAt
        )
        if (findedCreatedAt) {
          findedCreatedAt.count++
        }
      }
    }
    return {
      totalUsersWithOneOrder,
      totalUsersWithTwoOrder,
      totalUsersWithThreeOrder,
      chart: timeList
    }
  } catch {
    return null
  }
}

const findAll = async (req, res) => {
  try {
    const ordersOfProvinces = await getOrdersOfProvinces()

    if (!ordersOfProvinces?.isSuccess)
      return httpError(ordersOfProvinces?.message, res)

    const orders = await sequelize.models.orders.count({
      where: {
        [Op.or]: [
          {
            status: 'preparing'
          },
          { status: 'pending' }
        ]
      }
    })
    const withdrawals = await sequelize.models.withdrawals.count({
      where: {
        status: 'pending'
      }
    })

    const cooperations = await sequelize.models.cooperations.count({
      where: {
        status: 'pending'
      }
    })

    const adminId = req?.user[0]?.id
    const admin = await sequelize.models.admins.findOne({
      include: {
        model: sequelize.models.admins_roles,
        as: 'role',
        attributes: ['id', 'name']
      },
      where: {
        id: adminId
      },
      attributes: {
        exclude: ['password', 'roleId']
      }
    })

    const usersOrders = await getUsersOrders()

    const sales = await getSales()

    const ordersChart = await getOrders()

    const users = await getUsers()

    res.status(200).send({
      statusCode: 200,
      data: {
        admin,
        orders: ordersChart,
        users,
        usersOrders,
        sales,
        sidebarData: {
          countOfPendingCooperations: cooperations,
          countOfInProgressOrders: orders,
          countOfPendingWithdrawals: withdrawals
        },
        provincesOrders: ordersOfProvinces?.data
      }
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = {
  findUsers,
  findOrders,
  findUserOrder,
  findSales,
  findAll
}
