const { Op } = require('sequelize')
const { sequelize } = require('./src/v1/models')

const restoreOldUsersBalance = async () => {
  try {
    const users = await sequelize.models.users.findAll({
      where: {
        balance: { [Op.not]: 0 }
      }
    })

    for (const user of users) {
      sequelize.models.transactions
        .create(
          {
            userId: user?.id,
            type: 'deposit',
            change: 'increase',
            status: 'successful',
            amount: user?.balance,
            description: 'افزایش موجودی کیف پول'
          },
          { transaction: t }
        )
        .then(() => null)
        .catch(console.log)
    }
  } catch (e) {
    console.log(e)
  }
}

restoreOldUsersBalance()
  .then(() => null)
  .catch(console.log)
