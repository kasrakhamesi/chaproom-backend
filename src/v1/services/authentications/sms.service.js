const { sequelize } = require('../../models')
const { uniqueGenerates, regex } = require('../../libs')
const _ = require('lodash')
const Kavenegar = require('kavenegar')
const api = Kavenegar.KavenegarApi({
  apikey: 'your apikey here'
})

const send = async (
  creatorId,
  phoneNumber,
  isAdmin = true,
  isPasswordReset = false
) => {
  try {
    if (!regex.iranPhone(phoneNumber)) throw new Error('Invalid phone number')

    const creatorKey = isAdmin ? 'adminId' : 'userId'

    const where =
      creatorId === null
        ? {
            phone: phoneNumber,
            passwordReset: isPasswordReset,
            used: false
          }
        : {
            [creatorKey]: creatorId,
            phone: phoneNumber,
            passwordReset: isPasswordReset,
            used: false
          }

    const verifyData = await sequelize.models.verifies.findOne({
      where: where,
      order: [['id', 'DESC']]
    })

    if (!_.isEmpty(verifyData) && parseInt(verifyData?.expireAt) > Date.now())
      return isResend
        ? {
            statusCode: 400,
            data: {
              expireAt: verifyData?.expireAt
            },
            error: {
              code: '2fa.locked',
              message: 'Your 2Fa code is locked,waiting for unlock'
            }
          }
        : {
            statusCode: 200,
            data: {
              status: 'success',
              message: 'code sent before',
              phoneNumber: `09** *** *${phoneNumber.substr(
                phoneNumber.length - 3
              )}`,
              expireAt: verifyData?.expire
            },
            error: null
          }

    const oneTimeCode = '787878' //uniqueGenerates.randomNumber()
    /*
    const r = await api.VerifyLookup({
      receptor: 'your receptor mobile number',
      token: 'your token',
      template: 'your template'
    })
*/
    const body =
      creatorId === null
        ? {
            userId: null,
            adminId: null,
            email: null,
            phone: phoneNumber,
            code: oneTimeCode,
            used: false,
            expire: Date.now() + 1000 * 60 * 2
          }
        : {
            [creatorKey]: creatorId,
            email: null,
            phone: phoneNumber,
            code: oneTimeCode,
            used: false,
            expireAt: Date.now() + 1000 * 60 * 2
          }

    const resCreateCode = await sequelize.models.verifies.create(body)

    if (!resCreateCode?.id)
      throw new Error("Can't Send Sms,Please Call Administrator")

    return {
      statusCode: 200,
      data: {
        status: 'success',
        message: 'code sent',
        phoneNumber: `09** *** *${phoneNumber.substr(phoneNumber.length - 3)}`,
        expire: String(Date.now() + 1000 * 60 * 2)
      },
      error: null
    }
  } catch (e) {
    const errorMessage = e?.errors?.message || e.message
    return errors.configs.findErrorCode(errorMessage)
  }
}

const check = async (
  creatorId,
  code,
  phoneNumber = null,
  isAdmin = true,
  isCreated = false,
  isForgetPassword = false
) => {
  try {
    const creatorKey = isAdmin ? 'adminId' : 'userId'

    const where =
      creatorId === null && phoneNumber !== null
        ? {
            code: code,
            phone: phoneNumber,
            used: false
          }
        : {
            [creatorKey]: creatorId,
            code: code,
            used: false
          }

    const verifyData = await sequelize.models.verifies.findOne({
      where: where,
      order: [['id', 'DESC']]
    })

    if (_.isEmpty(verifyData)) throw new Error('Invalid Code')

    const userToken =
      isAdmin && !isCreated
        ? null
        : generateRandomToken(phoneNumber, code, isForgetPassword)

    const userTokenExpireTimestamp = Date.now() + 1000 * 60 * 30

    await verifyData.update({
      used: true,
      user_token: isCreated ? userToken : null,
      user_token_used: isCreated ? false : null,
      user_token_expire: isCreated ? userTokenExpireTimestamp : null
    })

    return {
      statusCode: 200,
      data: isCreated
        ? {
            status: 'success',
            message: 'successfully confirmed',
            token: userToken,
            expire: String(userTokenExpireTimestamp)
          }
        : { status: 'success', message: 'login successfully' },
      error: null
    }
  } catch (e) {
    const errorMessage = e?.errors?.message || e.message
    return errors.configs.findErrorCode(errorMessage)
  }
}

module.exports = {
  send,
  check
}
