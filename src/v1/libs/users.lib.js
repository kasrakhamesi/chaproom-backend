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

    outgoing = await Promise.all(outgoing)
    incoming = await Promise.all(incoming)

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
    return {
      isSuccess: false,
      message: e.message
    }
  }
}

module.exports = { getBalance }
