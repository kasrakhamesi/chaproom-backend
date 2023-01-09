const { httpError, messageTypes, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')

const create = async (req, res) => {
  try {
    const { name, message, phoneNumber } = req.body
    const data = {
      name,
      message,
      phoneNumber
    }
    const contactUs = await sequelize.models.contact_us.findOne({
      where: {
        phoneNumber,
        checked: false
      }
    })

    if (contactUs) return httpError(errorTypes.PENDING_CONTACT_US_EXIST, res)

    await sequelize.models.contact_us.create(data)
    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

module.exports = { create }
