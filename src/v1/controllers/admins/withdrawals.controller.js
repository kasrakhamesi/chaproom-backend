const { sequelize } = require('../../models')
const { restful, filters, users } = require('../../libs')
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
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
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
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { status, trackingNumber, description } = req.body
    const adminId = req?.user[0]?.id

    const data = {
      status,
      trackingNumber,
      description,
      adminId
    }

    if (status !== 'rejected' && status !== 'done')
      return httpError(errorTypes.STATUS_NOT_ALLOWED, res)

    const withdrawal = await sequelize.models.withdrawals.findOne({
      where: {
        id
      }
    })

    if (!withdrawal) return httpError(errorTypes.WITHDRAWAL_NOT_FOUND, res)

    const t = await sequelize.transaction()

    await withdrawal.update(data, { transaction: t })

    const user = await sequelize.models.users.findOne({
      where: {
        id: withdrawal?.userId
      }
    })

    const transaction = await sequelize.models.transactions.findOne({
      where: {
        withdrawalId: id
      }
    })

    await transaction.update(
      {
        type: 'withdrawal',
        status: status === 'rejected' ? 'unsuccessful' : 'successful',
        description:
          status === 'rejected'
            ? description
            : `برداشت موجودی با کد پیگیری : ${trackingNumber}`
      },
      { transaction: t }
    )

    if (status === 'done') {
      await user.update(
        {
          activeWithdrawalBalance: 0,
          activeWithdrawalMarketingBalance: 0,
          totalDebtor: user?.totalDebtor + user?.balance
        },
        { transaction: t }
      )
    } else {
      const userWallet = await users.getBalance(withdrawal?.userId)

      if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)
      await user.update(
        {
          balance: userWallet?.data?.balance + user?.activeWithdrawalBalance,
          marketingBalance:
            user?.activeWithdrawalMarketingBalance + user?.marketingBalance,
          activeWithdrawalBalance: 0,
          activeWithdrawalMarketingBalance: 0
        },
        { transaction: t }
      )
    }

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAll, findOne, update }
