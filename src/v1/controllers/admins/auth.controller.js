const { httpError, errorTypes, messageTypes } = require('../../configs')
const { authorize } = require('../../middlewares')
const { sequelize } = require('../../models')
const { authentications } = require('../../services')
const _ = require('lodash')
const { utils } = require('../../libs')

const login = (req, res) => {
  const { phoneNumber, password } = req.body
  return sequelize.models.admins
    .findOne({
      where: {
        phoneNumber,
        password
      },
      attributes: {
        exclude: ['password', 'roleId']
      }
    })
    .then((r) => {
      if (!r) return httpError(errorTypes.INVALID_PHONE_PASSWORD, res)
      return authentications.sms
        .send({ phoneNumber, isAdmin: true })
        .then((r) => {
          return res.status(r?.statusCode).send(r)
        })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const loginConfirm = async (req, res) => {
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

    const r = await sequelize.models.admins.findOne({
      include: {
        model: sequelize.models.admins_roles,
        as: 'role',
        attributes: ['id', 'name']
      },
      where: {
        phoneNumber
      },
      attributes: [
        'id',
        'name',
        'phoneNumber',
        'active',
        'createdAt',
        'updatedAt'
      ]
    })

    const accessToken = authorize.generateAdminJwt(r?.id, r?.phoneNumber)
    return res.status(200).send({
      statusCode: 200,
      data: {
        ...r?.dataValues,
        avatar: null,
        token: {
          access: accessToken,
          expire: utils.timestampToIso(authorize.decodeJwt(accessToken).exp)
        }
      },
      error: null
    })
  } catch (e) {
    console.log(e)
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
      isAdmin: true
    })
    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const passwordReset = async (req, res) => {
  try {
    const { phoneNumber } = req.body

    const user = await sequelize.models.admins.findOne({
      where: {
        phoneNumber
      }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const r = await authentications.sms.send({
      phoneNumber,
      creatorId: user?.id,
      isAdmin: true,
      isPasswordReset: true
    })

    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const passwordResetConfirmCode = (req, res) => {
  const { code, phoneNumber } = req.body
  return authentications.sms
    .check({ code, phoneNumber, isAdmin: true, isPasswordReset: true })
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

    await sequelize.models.admins.update(
      {
        password: newPassword
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
  login,
  loginConfirm,
  passwordReset,
  passwordResetConfirmCode,
  passwordResetSubmit,
  resendCode
}
