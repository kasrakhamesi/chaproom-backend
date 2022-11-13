const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { Op } = require('sequelize')
const _ = require('lodash')
const bcrypt = require('bcrypt')

class PersianDate extends Date {
  constructor(...args) {
    super(...args)
  }

  getParts = () => this.toLocaleDateString('fa-IR-u-nu-latn').split('/')
  getDay = () => (super.getDay() === 6 ? 0 : super.getDay() + 1)
  getDate = () => this.getParts()[2]
  getMonth = () => this.getParts()[1] - 1
  getYear = () => this.getParts()[0]
  getMonthName = () => this.toLocaleDateString('fa-IR', { month: 'long' })
  getDayName = () => this.toLocaleDateString('fa-IR', { weekday: 'long' })
}

const TIMES = {
  DAILY: 1000 * 60 * 60 * 24,
  WEEKLY: 1000 * 60 * 60 * 24 * 7,
  MONTHYLY: 1000 * 60 * 60 * 24 * 30
}

const findUsers = async () => {
  try {
    /*
    const { ticker } = req.params

    const users = await sequelize.models.users.findAndCountAll({
      attributes: ['createdAt'],
      order: [['id', 'desc']]
    })

    const data = []
    let currentDay = 0
    for (const user of users) {
      const date = new PersianDate(user.createdAt)
      if (ticker === 'daily') {
        currentDay = date.getDate()
        while (date.getDate() ===)
          data.push({
            date: `${date.getMonth()}/${date.getDate()}`
          })
      } else if (ticker === 'weekly') {
      } else if (ticker === 'monthly') {
      }
    }
    */
  } catch (e) {
    return httpError(e, res)
  }
}

const findOrders = async () => {}

const findSales = async () => {}

const findUserOrder = async () => {}

const findOrdersFromProvince = async () => {}

const findOne = async (req, res) => {
  try {
    const userId = req?.user[0]?.id
    const user = await sequelize.models.users.findOne({
      where: {
        id: userId
      },
      attributes: {
        exclude: ['password']
      }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const orders = await sequelize.models.orders.findAll({
      where: {
        userId,
        status: { [Op.not]: 'sent' },
        status: { [Op.not]: 'payment_pending' },
        status: { [Op.not]: 'canceled' }
      },
      attributes: ['id', 'status', 'amount', 'createdAt', 'updatedAt']
    })

    const promises = await Promise.all([
      getBindingPriceses(),
      getPrintPriceses()
    ])

    const binding = _.isEmpty(promises[0])
      ? null
      : {
          springNormal: {
            a4: promises[0].a4_springNormal,
            a3: promises[0].a3_springNormal,
            a5: promises[0].a5_springNormal
          },
          springPapco: {
            a4: promises[0].a4_springPapco,
            a3: promises[0].a3_springPapco,
            a5: promises[0].a5_springPapco
          },
          stapler: promises[0].stapler
        }

    const print = _.isEmpty(promises[1]) ? null : promises[1]

    const r = {
      ...user.dataValues,
      walletBalance: user?.balance - user?.marketingBalance,
      avatar: null,
      inProgressOrders: orders,
      tariffs: {
        binding,
        print
      }
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

module.exports = { findOne }
