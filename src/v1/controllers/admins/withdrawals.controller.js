const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const withdrawals = new restful(sequelize.models.withdrawals)

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.withdrawals
    )

    const r = await withdrawals.Get({
      attributes: {
        exclude: ['userId', 'adminId']
      },
      include: [
        {
          model: sequelize.models.users,
          as: 'user',
          attributes: ['id', 'name', 'phoneNumber']
        }
      ],
      where,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params
    const r = await withdrawals.Get({
      attributes: {
        exclude: ['userId', 'adminId']
      },
      include: [
        {
          model: sequelize.models.users,
          as: 'user',
          attributes: ['id', 'name', 'phoneNumber']
        }
      ],
      where: {
        id
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { status, trackingNumber, description } = req.body

    const data = {
      status,
      trackingNumber,
      description
    }

    if (status !== 'successful' && status !== 'unsuccessful')
      return httpError(errorTypes.STATUS_NOT_ALLOWED, res)

    const t = await sequelize.transaction()

    await sequelize.models.withdrawals.update(
      data,
      {
        where: {
          id
        }
      },
      {
        transaction: t
      }
    )

    await sequelize.models.transactions.update(
      {
        type: 'withdrawal',
        status: status,
        description
      },
      {
        where: { withdrawalId: id }
      },
      { transaction: t }
    )

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = { findAll, findOne, update }
