const { httpError, errorTypes } = require('../../configs')
const { authorize } = require('../../middlewares')
const { sequelize } = require('../../models')
const { authentications } = require('../../services')
const { uniqueGenerates } = require('../../libs')

const bcrypt = require('bcrypt')

const register = (req, res) => {
  const { phoneNumber, name, password, referralSlug } = req.body
  const data = { phoneNumber, name, password, referralSlug }

  return authentications.sms
    .send({ phoneNumber, registerData: data })
    .then((r) => {
      return res.status(r?.statusCode).send(r)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const registerConfirm = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body

    if (typeof code !== 'number')
      return httpError(errorTypes.INVALID_OTP_TYPE, res)

    const auth = await authentications.sms.check({ code, phoneNumber })

    if (auth.statusCode !== 200) return res.status(auth.statusCode).send(auth)

    const data = {
      name: auth?.data?.registerData?.name,
      phoneNumber: auth?.data?.registerData?.phoneNumber,
      password: auth?.data?.registerData?.password
    }

    const referralSlug = auth?.data?.registerData?.referralSlug

    const referrals = await sequelize.models.referrals.findOne({
      where: {
        slug: referralSlug
      }
    })

    const t = await sequelize.transaction()

    const r = await sequelize.models.users.create(data, { transaction: t })

    const discountCodes = await uniqueGenerates.discountCode(2)

    await sequelize.models.discounts.create(
      {
        userId: r?.id,
        value: '5',
        type: 'percentage',
        code: discountCodes[0],
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

    const accessToken = authorize.generateUserJwt(r?.id, r?.phoneNumber)
    return res.status(200).send({
      statusCode: 200,
      data: {
        ...r?.dataValues,
        walletBalance: r?.balance - r?.marketingBalance,
        token: { access: accessToken }
      },
      error: null
    })
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

const login = (req, res) => {
  const { phoneNumber, password } = req.body
  return sequelize.models.users
    .findOne({
      where: {
        phoneNumber,
        password
      },
      attributes: {
        exclude: ['password']
      }
    })
    .then((r) => {
      if (!r) httpError(errorTypes.INVALID_PHONE_PASSWORD, res)
      const accessToken = authorize.generateUserJwt(r?.id, r?.phoneNumber)
      return res.status(200).send({
        statusCode: 200,
        data: {
          ...r?.dataValues,
          walletBalance: r?.balance - r?.marketingBalance,
          token: { access: accessToken }
        },
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const passwordReset = async (req, res) => {
  try {
    const { phoneNumber } = req.body

    const user = await sequelize.models.users.findOne({
      phoneNumber
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const r = await authentications.sms.send({
      phoneNumber,
      isPasswordReset: true
    })

    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const passwordResetConfirm = (req, res) => {}

module.exports = {
  register,
  login,
  registerConfirm,
  passwordReset,
  passwordResetConfirm
}
