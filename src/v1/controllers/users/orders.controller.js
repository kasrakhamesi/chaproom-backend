const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')

const create = async (req, res) => {
  try {
    const { folders, addressId } = req.body

    const address = await sequelize.models.addresses.findOne({
      where: {
        userId,
        id: addressId
      }
    })

    if (!address) return httpError(errorTypes.INVALID_ADDRESS, res)

    if (_.isEmpty(folders)) return httpError(errorTypes.MISSING_FOLDERS, res)

    const data = {
      addressId,
      recipientName: address?.recipientName,
      recipientPhoneNumber: address?.recipientPhoneNumber,
      recipientPostalCode: address?.recipientPostalCode,
      recipientDeliveryProvince: address?.recipientDeliveryProvince,
      recipientDeliveryCity: address?.recipientDeliveryCity,
      recipientDeliveryAddress: address?.recipientDeliveryAddress,
      status: 'pending',
      price: 'test'
    }
  } catch (e) {
    return httpError(e, res)
  }
}

const findAll = (req, res) => {}

const findOne = (req, res) => {}

const update = (req, res) => {}

module.exports = { create, findAll, findOne, update }
