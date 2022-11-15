const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, messageTypes, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
const discounts = new restful(sequelize.models.discounts)

const create = async (req, res) => {
  try {
    const {
      type,
      value,
      code,
      description,
      pageLimit,
      usageLimit,
      phoneNumber,
      userId,
      expireAt
    } = req.body
    const data = {
      type,
      value,
      code,
      userId: userId ? userId : null,
      active: true,
      description,
      phoneNumber,
      pageLimit,
      usageLimit,
      timesUsed: 0,
      benefit: 0,
      totalSale: 0,
      expireAt: expireAt ? expireAt : null,
      userMarketing: false
    }

    const checkExistDiscountCode = await sequelize.models.discounts.findOne({
      where: {
        code
      }
    })

    if (checkExistDiscountCode)
      return httpError(errorTypes.DISCOUNT_CODE_EXIST, res)

    if (userId) {
      const user = await sequelize.models.users.findOne({
        where: {
          id: userId
        }
      })

      if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)
    }

    await sequelize.models.discounts.create(data)

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    httpError(e, res)
  }
}

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.discounts
    )

    const newWhere = { ...where, userMarketing: false }

    const r = await discounts.Get({
      include: [
        {
          model: sequelize.models.users,
          attributes: ['name', 'phoneNumber', 'id']
        }
      ],
      attributes: {
        exclude: ['userId', 'adminId', 'userMarketing']
      },
      where: newWhere,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params
    const r = await discounts.Get({
      include: [
        {
          model: sequelize.models.users,
          attributes: ['name', 'phoneNumber', 'id']
        }
      ],
      attributes: {
        exclude: ['userId', 'adminId']
      },
      where: {
        id
      }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const {
      type,
      value,
      code,
      active,
      description,
      pageLimit,
      usageLimit,
      phoneNumber,
      userId,
      expireAt
    } = req.body

    const data = {
      type,
      value,
      code,
      userId,
      active,
      phoneNumber,
      description,
      pageLimit,
      usageLimit,
      expireAt
    }

    const checkMarketingDiscountCode = await sequelize.models.discounts.findOne(
      {
        where: {
          id,
          userMarketing: true
        }
      }
    )

    if (checkMarketingDiscountCode)
      return httpError(errorTypes.CAN_NOT_EDIT_MARKETING_DISCOUNT, res)

    const checkExistDiscountCode = await sequelize.models.discounts.findOne({
      where: {
        id: { [Op.not]: id },
        code
      }
    })

    if (checkExistDiscountCode)
      return httpError(errorTypes.DISCOUNT_CODE_EXIST, res)

    if (userId) {
      const user = await sequelize.models.users.findOne({
        where: {
          id: userId
        }
      })

      if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)
    }

    const r = await discounts.Put({ body: data, req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

const softDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await discounts.Delete({
      req,
      where: { id, userMarketing: false }
    })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = { create, findAll, findOne, update, softDelete }
