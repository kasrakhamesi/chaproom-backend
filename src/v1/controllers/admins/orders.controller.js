const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
const orders = new restful(sequelize.models.orders)

const findAllByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.orders
    )

    const newWhere = {
      ...where,
      status: { [Op.not]: 'payment_pending' },
      userId
    }

    const r = await orders.Get({
      attributes: ['id', 'createdAt', 'amount', 'status', 'cancelReason'],
      where: newWhere,
      order,
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

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.orders
    )

    const newWhere = {
      ...where,
      status: { [Op.not]: 'payment_pending' }
    }

    const r = await orders.Get({
      attributes: ['id', 'createdAt', 'amount', 'status', 'cancelReason'],
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

const findOne = (req, res) => {
  const { id } = req.params
  return sequelize.models.orders
    .findOne({
      where: {
        id
      },
      attributes: {
        exclude: [
          'userId',
          'addressId',
          'discountId',
          'discountType',
          'discountValue',
          'paymentId',
          'adminId',
          'order_folders',
          'referralId',
          'marketerBenefit',
          'referralBenefit',
          'referralCommission'
        ]
      },
      include: [
        {
          model: sequelize.models.folders,
          attributes: {
            exclude: ['userId', 'used']
          },
          through: {
            attributes: {
              exclude: [
                'userId',
                'createdAt',
                'updatedAt',
                'orderId',
                'folderId'
              ]
            }
          },
          include: {
            model: sequelize.models.files,
            attributes: {
              exclude: ['userId', 'folder_files']
            },
            through: {
              attributes: {
                exclude: [
                  'userId',
                  'createdAt',
                  'updatedAt',
                  'fileId',
                  'folderId'
                ]
              }
            }
          }
        }
      ]
    })
    .then((r) => {
      const folders = r?.folders.map((item) => {
        if (item?.binding !== null) {
          item.binding =
            process.env.RUN_ENVIRONMENT === 'local'
              ? JSON.parse(JSON.parse(item?.binding))
              : JSON.parse(item?.binding)
          return item
        }
        return item
      })
      r.folders = folders
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { status, sendMethod, trackingNumber, cancelReason } = req.body

    const data = {
      status,
      trackingNumber,
      cancelReason,
      sendMethod
    }

    if (status !== 'preparing' && status !== 'sent' && status !== 'canceled')
      return httpError(errorTypes.INVALID_ORDER_STATUS, res)

    const r = await addresses.Put({ body: data, req, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    httpError(e, res)
  }
}

module.exports = { findAll, findOne, update, findAllByUserId }
