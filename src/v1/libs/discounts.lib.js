const { utils } = require('.')
const { httpError, errorTypes } = require('../configs')
const { sequelize } = require('../models')
const _ = require('lodash')

const check = async (discountCode, userId) => {
  try {
    const discount = await sequelize.models.discounts.findOne({
      where: {
        code: discountCode
      }
    })

    if (typeof userId === 'number') {
      if (discount?.userId !== userId && !discount?.userMarketing)
        return httpError(errorTypes.DISCOUNT_CODE_NOT_FOR_YOU)
      else if (discount?.userId === userId && discount?.userMarketing)
        return httpError(errorTypes.MARKETING_DISCOUNT_CODE_NOT_FOR_YOU)

      const order = await sequelize.models.orders.findOne({
        where: {
          discountId: discount?.id,
          userId
        }
      })

      if (!_.isEmpty(order))
        return httpError(errorTypes.USER_USED_DISCOUNT_CODE)
    }

    if (!discount) return httpError(errorTypes.DISCOUNT_CODE_NOT_FOUND)

    if (!discount?.active) return httpError(errorTypes.DISCOUNT_CODE_INACTIVE)

    if (
      discount?.expireAt !== null &&
      utils.isoToTimestamp(discount?.expireAt) < Date.now()
    )
      return httpError(errorTypes.DISCOUNT_CODE_EXPIRED)

    if (parseInt(discount?.timesUsed) >= parseInt(discount?.usageLimit))
      return httpError(errorTypes.DISCOUNT_CODE_USAGE_LIMIT)

    return {
      statusCode: 200,
      data: discount,
      error: null
    }
  } catch (e) {
    return httpError(e)
  }
}

const calculator = (discountData, price) => {
  const { type, value } = discountData
  if (type === 'percentage') {
    const payableAmount = parseFloat((price * parseInt(value)) / 100)
    return payableAmount
  } else if (type === 'fixed') {
    const payableAmount = value //parseFloat(price - value)
    return payableAmount
  } else if (type === 'page') {
    const payableAmount = value //parseFloat(price - value)
    return payableAmount
  }
  return price
}

module.exports = { check, calculator }
