const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const findOne = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const discounts = await sequelize.models.discounts.findAll({
      where: {
        userId,
        userMarketing: true
      }
    })

    const referral = await sequelize.models.referrals.findOne({
      where: {
        userId
      },
      attributes: {
        exclude: ['id', 'userId', 'referralUserId']
      }
    })

    let totalSales = 0
    let benefit = 0
    let timesUsed = 0

    for (const entity of discounts) {
      timesUsed += entity?.timesUsed
      totalSales += entity?.totalSale
      benefit += entity?.benefit
    }

    const r = {
      discount: { totalSales, benefit, timesUsed, data: discounts },
      referral
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
