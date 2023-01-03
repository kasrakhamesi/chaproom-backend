const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError } = require('../../configs')
const { Op } = require('sequelize')
const orders = new restful(sequelize.models.orders)

const findAllDiscounts = async (req, res) => {
  try {
    const { page, pageSize, search } = req.query
    const where = []
    where.push(
      {
        '$user.name$': {
          [Op.like]: `%${search}%`
        }
      },
      {
        '$user.phoneNumber$': {
          [Op.like]: `%${search}%`
        }
      }
    )

    const r = await orders.Get({
      include: [
        {
          model: sequelize.models.users,
          attributes: ['id', 'name', 'phoneNumber']
        },
        {
          model: sequelize.models.discounts,
          include: {
            model: sequelize.models.users,
            attributes: ['id', 'name', 'phoneNumber']
          }
        }
      ],
      where: {
        [Op.or]: where,
        discountId: { [Op.not]: null },
        '$discount.userMarketing$': true,
        status: { [Op.or]: ['sent', 'preparing'] }
      },
      attributes: [
        'id',
        'discountCode',
        'discountType',
        'discountValue',
        'discountAmount',
        'discountBenefit',
        'createdAt',
        'amount'
      ],
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return httpError(r, res)

    res.status(r?.statusCode).send({
      statusCode: r?.statusCode,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        marketings: r?.data?.orders
          .filter((item) => item?.discount?.userMarketing)
          .map((item) => {
            return {
              user: {
                id: item?.discount?.user?.id,
                name: item?.discount?.user?.name,
                phoneNumber: item?.discount?.user?.phoneNumber
              },
              buyer: {
                id: item?.user?.id,
                name: item?.user?.name,
                phoneNumber: item?.user?.phoneNumber
              },
              orderId: item?.id,
              discountCode: item?.discountCode,
              discountType: item?.discountType,
              discountValue: item?.discountValue,
              discountAmount: item?.discountAmount,
              discountBenefit: item?.discountBenefit,
              discountBenefitPercentage: item?.discountValue,
              createdAt: item?.createdAt,
              amount: item?.amount
            }
          })
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findAllReferrals = async (req, res) => {
  try {
    const { page, pageSize, search } = req.query
    const where = []
    where.push(
      {
        '$user.name$': {
          [Op.like]: `%${search}%`
        }
      },
      {
        '$user.phoneNumber$': {
          [Op.like]: `%${search}%`
        }
      }
    )
    const r = await orders.Get({
      include: [
        {
          model: sequelize.models.users,
          attributes: ['id', 'name', 'phoneNumber']
        },
        {
          model: sequelize.models.referrals,
          attributes: {
            exclude: 'referral'
          },
          include: [
            {
              model: sequelize.models.users,
              as: 'user',
              attributes: ['id', 'name', 'phoneNumber']
            },
            {
              model: sequelize.models.users,
              as: 'referralUser',
              attributes: ['id', 'name', 'phoneNumber']
            }
          ]
        }
      ],
      where: {
        [Op.or]: where,
        referralId: { [Op.not]: null },
        status: { [Op.or]: ['sent', 'preparing'] }
      },
      attributes: [
        'id',
        'referralId',
        'referralBenefit',
        'referralCommission',
        'createdAt',
        'amount'
      ],
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (r?.statusCode !== 200) return httpError(r, res)

    res.status(r?.statusCode).send({
      statusCode: r?.statusCode,
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        marketings: r.data.orders.map((item) => {
          return {
            buyer: {
              id: item.user.id,
              name: item.user.name,
              phoneNumber: item.user.phoneNumber
            },
            user: {
              id: item.referral.referralUser.id,
              name: item.referral.referralUser.name,
              phoneNumber: item.referral.referralUser.phoneNumber
            },
            orderId: item.id,
            referralSlug: item.referral.slug,
            createdAt: item.createdAt,
            referralBenefit: item.referralBenefit,
            referralCommission: item.referralCommission,
            amount: item.amount
          }
        })
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAllDiscounts, findAllReferrals }
