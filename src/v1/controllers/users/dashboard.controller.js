const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { Op } = require('sequelize')
const _ = require('lodash')
require('dotenv').config()
const bcrypt = require('bcrypt')

const getBindingPriceses = () => {
  return sequelize.models.binding_tariffs
    .findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt']
      }
    })
    .then((r) => {
      return r
    })
}

const getPrintPriceses = () => {
  return sequelize.models.print_tariffs
    .findOne({
      where: { id: 1 },
      attributes: ['a3', 'a4', 'a5']
    })
    .then((r) => {
      const data =
        process.env.RUN_ENVIRONMENT === 'local'
          ? {
              a3: JSON.parse(r.a3),
              a4: JSON.parse(r.a4),
              a5: JSON.parse(r.a5)
            }
          : r

      return data
    })
}

const findOne = async (req, res) => {
  try {
    const userId = req?.user[0]?.id
    let user = await sequelize.models.users.findOne({
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
        [Op.or]: [
          {
            status: 'pending'
          },
          {
            status: 'preparing'
          },
          {
            status: 'sent',
            updatedAt: { [Op.gt]: Date.now() - 1000 * 60 * 60 * 24 * 3 }
          }
        ]
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
      ...user?.dataValues,
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
    console.log(e)
    return httpError(e, res)
  }
}

module.exports = { findOne }
