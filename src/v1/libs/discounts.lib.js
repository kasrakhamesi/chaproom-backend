const { utils } = require('.')
const { httpError, errorTypes } = require('../configs')
const { sequelize } = require('../models')
const _ = require('lodash')

const check = async (discountCode, userId, folders) => {
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

    for (const folder of folders) {
      if (discount?.type === 'page') break
      if (
        folder?.color === 'black_and_white' &&
        discount?.type === 'pageBlackAndWhite'
      )
        break
      if (
        folder?.color === 'normal_color' &&
        discount?.type === 'pageNormalColor'
      )
        break
      if (folder?.color === 'full_color' && discount?.type === 'pageFullColor')
        break
      return httpError(
        errorTypes.DISCOUNT_CODE_IS_NOT_ACTIVE_FOR_YOUR_FOLDER_PRINT_COLOR
      )
    }

    return {
      statusCode: 200,
      data: discount,
      error: null
    }
  } catch (e) {
    return httpError(e)
  }
}

const calculator = (discountData, price, folders) => {
  const { type, value } = discountData
  if (type === 'percentage') {
    const payableAmount = parseFloat((price * parseInt(value)) / 100)
    return payableAmount
  } else if (type === 'fixed') {
    const payableAmount = value //parseFloat(price - value)
    return payableAmount
  } else if (type === 'page') {
    if (folders?.length > 0) return value * folders[0]?.shipmentPrice
    return price
  } else if (type === 'pageBlackAndWhite') {
    let countOfAllPages = 0
    let haveBlackAndWhite = false
    let shipmentPrice = 0
    for (const folder of folders) {
      if (folder?.color === 'black_and_white') {
        countOfAllPages += folder?.countOfPages
        haveBlackAndWhite = true
        shipmentPrice = folder?.shipmentPrice
      }
    }
    if (haveBlackAndWhite) {
      if (countOfAllPages >= value) return value * shipmentPrice
      return countOfAllPages * shipmentPrice
    }
  } else if (type === 'pageNormalColor') {
    let countOfAllPages = 0
    let haveNormalColor = false
    let shipmentPrice = 0
    for (const folder of folders) {
      if (folder?.color === 'normal_color') {
        countOfAllPages += folder?.countOfPages
        haveNormalColor = true
        shipmentPrice = folder?.shipmentPrice
      }
    }
    if (haveNormalColor) {
      if (countOfAllPages >= value) return value * shipmentPrice
      return countOfAllPages * shipmentPrice
    }
  } else if (type === 'pageFullColor') {
    let countOfAllPages = 0
    let haveFullColor = false
    let shipmentPrice = 0
    for (const folder of folders) {
      if (folder?.color === 'full_color') {
        countOfAllPages += folder?.countOfPages
        haveFullColor = true
        shipmentPrice = folder?.shipmentPrice
      }
    }
    if (haveFullColor) {
      if (countOfAllPages >= value) return value * shipmentPrice
      return countOfAllPages * shipmentPrice
    }
  }
  return null
}

module.exports = { check, calculator }
