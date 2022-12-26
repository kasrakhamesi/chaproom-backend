const { httpError, errorTypes, messageTypes } = require('../../configs')
const { authorize } = require('../../middlewares')
const { sequelize } = require('../../models')
const { authentications } = require('../../services')
const { uniqueGenerates, utils } = require('../../libs')
const _ = require('lodash')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
  try {
    const { phoneNumber, name, password, referralSlug } = req.body

    const data = {
      phoneNumber,
      name,
      password: bcrypt.hashSync(password, 12),
      referralSlug
    }

    const user = await sequelize.models.users.findOne({
      where: {
        phoneNumber
      }
    })

    if (!_.isEmpty(user)) return httpError(errorTypes.USER_EXIST_ERROR, res)

    const r = await authentications.sms.send({
      phoneNumber,
      isAdmin: false,
      registerData: data
    })
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const resendCode = async (req, res) => {
  try {
    const { phoneNumber } = req.body

    const previousSmsRequest = await sequelize.models.verifies.findOne({
      where: {
        phoneNumber
      },
      order: [['id', 'DESC']]
    })

    if (!previousSmsRequest)
      return httpError(errorTypes.RESEND_CODE_DATA_NOT_FOUND, res)

    const r = await authentications.sms.send({
      phoneNumber,
      isAdmin: false,
      registerData:
        previousSmsRequest?.registerData !== null
          ? previousSmsRequest?.registerData
          : null
    })
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const registerConfirm = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body

    if (typeof code !== 'number')
      return httpError(errorTypes.INVALID_OTP_TYPE, res)

    const auth = await authentications.sms.check({
      code,
      phoneNumber,
      isAdmin: false
    })

    if (auth.statusCode !== 200) return res.status(auth.statusCode).send(auth)

    const data = {
      name: auth?.data?.registerData?.name,
      phoneNumber: auth?.data?.registerData?.phoneNumber,
      password: auth?.data?.registerData?.password
    }

    const referralSlug = auth?.data?.registerData?.referralSlug || ''

    const referrals = await sequelize.models.referrals.findOne({
      where: {
        slug: referralSlug
      }
    })

    const t = await sequelize.transaction()

    const r = await sequelize.models.users.create(data, { transaction: t })

    delete r.password

    const discountCodes = await uniqueGenerates.discountCode(2)

    await sequelize.models.discounts.create(
      {
        userId: r?.id,
        value: '5',
        type: 'percentage',
        code: discountCodes[0],
        usageLimit: null,
        userMarketing: true
      },
      { transaction: t }
    )
    await sequelize.models.discounts.create(
      {
        userId: r?.id,
        value: '10',
        type: 'percentage',
        code: discountCodes[1],
        usageLimit: null,
        userMarketing: true
      },
      { transaction: t }
    )

    await sequelize.models.referrals.create(
      {
        userId: r?.id,
        referralUserId: referrals?.userId || null,
        slug: `ref=${r?.id}`
      },
      { transaction: t }
    )

    await t.commit()

    const userDiscount = await sequelize.models.discounts.findAll({
      where: { phoneNumber: data?.phoneNumber }
    })

    if (!_.isEmpty(userDiscount))
      await sequelize.models.discounts.update(
        {
          userId: r?.id
        },
        {
          where: {
            phoneNumber: data?.phoneNumber
          }
        }
      )

    const accessToken = authorize.generateUserJwt(r?.id, r?.phoneNumber)
    return res.status(200).send({
      statusCode: 200,
      data: {
        ...r?.dataValues,
        walletBalance: r?.balance - r?.marketingBalance,
        avatar: null,
        token: {
          access: accessToken,
          expireAt: utils.timestampToIso(
            authorize.decodeJwt(accessToken, false).exp
          )
        }
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body

    const user = await sequelize.models.users.findOne({
      where: {
        phoneNumber
      }
    })

    if (!user) return httpError(errorTypes.INVALID_PHONE_PASSWORD, res)

    if (!bcrypt.compareSync(password, user?.password.replace('$2y$', '$2a$')))
      return httpError(errorTypes.INVALID_PHONE_PASSWORD, res)

    const discounts = await sequelize.models.discounts.findOne({
      where: {
        userId: user?.id,
        userMarketing: true
      }
    })

    if (_.isEmpty(discounts)) {
      const t = await sequelize.transaction()

      const discountCodes = await uniqueGenerates.discountCode(2)

      await sequelize.models.discounts.create(
        {
          userId: user?.id,
          value: '5',
          type: 'percentage',
          code: discountCodes[0],
          usageLimit: null,
          userMarketing: true
        },
        { transaction: t }
      )
      await sequelize.models.discounts.create(
        {
          userId: user?.id,
          value: '10',
          type: 'percentage',
          code: discountCodes[1],
          usageLimit: null,
          userMarketing: true
        },
        { transaction: t }
      )

      await t.commit()
    }

    const accessToken = authorize.generateUserJwt(user?.id, user?.phoneNumber)

    delete user?.password

    return res.status(200).send({
      statusCode: 200,
      data: {
        ...user?.dataValues,
        walletBalance: user?.balance - user?.marketingBalance,
        avatar: null,
        token: {
          access: accessToken,
          expireAt: utils.timestampToIso(
            authorize.decodeJwt(accessToken, false).exp
          )
        }
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const passwordReset = async (req, res) => {
  try {
    const { phoneNumber } = req.body

    const user = await sequelize.models.users.findOne({
      where: {
        phoneNumber
      }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const r = await authentications.sms.send({
      phoneNumber,
      creatorId: user?.id,
      isAdmin: false,
      isPasswordReset: true
    })

    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const passwordResetConfirmCode = (req, res) => {
  const { code, phoneNumber } = req.body
  return authentications.sms
    .check({ code, phoneNumber, isAdmin: false, isPasswordReset: true })
    .then((r) => {
      return res.status(r?.statusCode).send(r)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const passwordResetSubmit = async (req, res) => {
  try {
    const { passwordResetToken, newPassword } = req.body
    if (!passwordResetToken || _.isEmpty(passwordResetToken))
      return httpError(errorTypes.CANT_PASSWORD_RESET, res)

    if (!newPassword || _.isEmpty(newPassword))
      return httpError(errorTypes.MISSING_PASSWORD, res)
    const r = await sequelize.models.verifies.findOne({
      where: {
        passwordResetToken
      }
    })

    if (!r) return httpError(errorTypes.CANT_PASSWORD_RESET, res)

    await sequelize.models.users.update(
      {
        password: bcrypt.hashSync(newPassword, 12)
      },
      {
        where: {
          id: r?.userId,
          phoneNumber: r?.phoneNumber
        }
      }
    )

    await r.update({ passwordResetToken: null })

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = {
  register,
  login,
  registerConfirm,
  passwordReset,
  passwordResetConfirmCode,
  passwordResetSubmit,
  resendCode
}
