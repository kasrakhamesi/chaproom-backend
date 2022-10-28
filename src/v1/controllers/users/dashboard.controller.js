const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

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
        status: { [Op.not]: 'user_canceled' },
        status: { [Op.not]: 'admin_canceled' }
      },
      attributes: ['id', 'status', 'amount', 'createdAt', 'updatedAt']
    })

    const r = {
      ...user.dataValues,
      walletBalance: user?.balance - user?.marketingBalance,
      avatar: null,
      inProgressOrders: orders
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
