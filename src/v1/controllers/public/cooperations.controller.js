const { httpError, messageTypes, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { Op } = require('sequelize')

const create = async (req, res) => {
  try {
    const { phoneNumber } = req.body
    const data = { phoneNumber }
    const cooperation = await sequelize.models.cooperations.findOne({
      where: {
        phoneNumber,
        description: { [Op.not]: 'درخواست مشاوره چاپ کتاب' },
        status: 'pending'
      }
    })

    if (cooperation) return httpError(errorTypes.PENDING_COOPERATION_EXIST, res)

    await sequelize.models.cooperations.create(data)
    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
  }
}

const createBookCounselingRequest = async (req, res) => {
  try {
    const { phoneNumber } = req.body
    const data = { phoneNumber, description: 'درخواست مشاوره چاپ کتاب' }
    const cooperation = await sequelize.models.cooperations.findOne({
      where: {
        phoneNumber,
        description: 'درخواست مشاوره چاپ کتاب',
        status: 'pending'
      }
    })

    if (cooperation)
      return httpError(errorTypes.PENDING_BOOK_PUBLISHING_EXIST, res)

    await sequelize.models.cooperations.create(data)
    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { create, createBookCounselingRequest }
