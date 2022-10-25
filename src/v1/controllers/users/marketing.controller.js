const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const findOne = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const discounts = await sequelize.models.discounts.findAll({
      where: {
        userId,
        userMarketing: true
      },
      attributes: {
        exclude: [
          'id',
          'userId',
          'adminId',
          'usageLimit',
          'expireAt',
          'timesUsed',
          'userMarketing',
          'description'
        ]
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

    const r = {
      discount: { totalSales: 0, benefit: 0, timesUsed: 0, data: discounts },
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
