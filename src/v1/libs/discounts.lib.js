const { uniqueGenerates } = require('.')
const { sequelize } = require('../models')

const create = async (userId) => {
  const discountCodes = await uniqueGenerates.discountCode(2)
  console.log(discountCodes)
  const r = await sequelize.models.discounts.bulkCreate([
    {
      userId,
      value: '5',
      type: 'percentage',
      code: discountCodes[0]
    },
    {
      userId,
      value: '10',
      type: 'percentage',
      code: discountCodes[1]
    }
  ])
  return r
}

module.exports = { create }
