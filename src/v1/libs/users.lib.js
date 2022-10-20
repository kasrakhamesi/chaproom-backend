const { sequelize } = require('../models')

const getBalance = async (userId) => {
  try {
    const userTransactions = await sequelize.models.transactions.findAll({
      where: {
        userId,
        status: 'approved'
      }
    })

    let incoming = 0
    let outgoing = 0

    for (const transaction of userTransactions) {
      if (transaction?.change === 'increase')
        incoming += parseInt(transaction?.amount)
      else outgoing += parseInt(transaction?.amount)
    }

    const balance = incoming - outgoing

    return {
      isSuccess: true,
      data: {
        outgoing,
        incoming,
        balance
      }
    }
  } catch (e) {
    console.log(e)
    return {
      isSuccess: false,
      message: e.message
    }
  }
}

const submitOrder = async (
  userId,
  paymentId,
  paymentAmount,
  refId,
  transaction
) => {
  const order = await sequelize.models.orders.findOne({
    where: {
      userId,
      paymentId,
      status: 'pending_payment'
    }
  })

  if (!order) return null
  const userWallet = await getBalance(userId)

  if (!userWallet?.isSuccess) return httpError(userWallet?.message, res)

  await sequelize.models.transactions.create(
    {
      userId,
      orderId: order?.id,
      type: 'order',
      change: 'decrease',
      balance: userWallet?.data?.balance,
      balanceAfter: userWallet?.data?.balance - paymentAmount,
      status: 'approved',
      amount: paymentAmount,
      description: 'ثبت سفارش'
    },
    { transaction }
  )

  await order.update(
    {
      status: 'pending'
    },
    { transaction }
  )

  return {
    statusCode: 200,
    data: {
      id: paymentAmount,
      orderId: order?.id,
      message: 'پرداخت با موفقعیت انجام شد',
      amount: paymentId,
      refId
    },
    error: null
  }
}

const transactions = async () => {}

module.exports = { getBalance, submitOrder, transactions }
