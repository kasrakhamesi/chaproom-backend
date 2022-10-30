const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { Op } = require('sequelize')

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
    .findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    .then((r) => {
      return r
    })
}

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

    const promises = await Promise.all([getPrintPriceses(), getBindingPriceses])

    const r = {
      ...user.dataValues,
      walletBalance: user?.balance - user?.marketingBalance,
      avatar: null,
      inProgressOrders: orders,
      tariffs: {
        binding: promises[0],
        print: _.isEmpty(promises[1])
          ? null
          : promises[1].map((item) => {
              return {
                id: item.id,
                type: item.type,
                size: item.size,
                single_sided: JSON.parse(item.single_sided),
                double_sided: JSON.parse(item.double_sided),
                single_sided_glossy: JSON.parse(item.single_sided_glossy),
                double_sided_glossy: JSON.parse(item.double_sided_glossy)
              }
            })
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
