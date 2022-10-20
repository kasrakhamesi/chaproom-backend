const { httpError, errorTypes } = require('../configs')
const { sequelize } = require('../models')

const check = async (discountCode) => {
  try {
    const discount = await sequelize.models.discounts.findOne({
      where: {
        code: discountCode
      }
    })

    if (!discount) return httpError(errorTypes.DISCOUNT_CODE_NOT_FOUND)

    if (!discount?.active) return httpError(errorTypes.DISCOUNT_CODE_INACTIVE)

    if (utils.isoToTimestamp(discount?.expireAt) < Date.now())
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

module.exports = { check }
