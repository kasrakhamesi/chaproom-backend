const { sequelize } = require('../../models')
const { uniqueGenerates, regex, utils } = require('../../libs')
const _ = require('lodash')
const Kavenegar = require('kavenegar')
const { httpError } = require('../../configs')
const api = Kavenegar.KavenegarApi({
  apikey: 'your apikey here'
})

const send = async ({
  phoneNumber,
  creatorId = null,
  isAdmin = true,
  isPasswordReset = false
}) => {
  try {
    if (!regex.iranPhone(phoneNumber)) throw new Error('Invalid phone number')

    const creatorKey = isAdmin ? 'adminId' : 'userId'

    const where =
      creatorId === null
        ? {
            phoneNumber,
            passwordReset: isPasswordReset,
            used: false
          }
        : {
            [creatorKey]: creatorId,
            phoneNumber,
            passwordReset: isPasswordReset,
            used: false
          }

    const verifyData = await sequelize.models.verifies.findOne({
      where: where,
      order: [['id', 'DESC']]
    })

    const phoneNumberNewStyle =
      creatorId === null
        ? phoneNumber
        : `09** *** *${phoneNumber.substr(phoneNumber.length - 3)}`

    if (
      !_.isEmpty(verifyData) &&
      utils.isoToTimestamp(verifyData?.expireAt) > Date.now()
    )
      return {
        statusCode: 200,
        data: {
          isSuccess: true,
          message: 'کد ارسال شد',
          phoneNumber: phoneNumberNewStyle,
          expireAt: verifyData?.expireAt
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
            phoneNumber,
            code: oneTimeCode,
            used: false,
            expireAt: utils.timestampToIso(Date.now() + 1000 * 60 * 2)
          }
        : {
            [creatorKey]: creatorId,
            email: null,
            phoneNumber,
            code: oneTimeCode,
            used: false,
            expireAt: utils.timestampToIso(Date.now() + 1000 * 60 * 2)
          }

    const resCreateCode = await sequelize.models.verifies.create(body)

    if (!resCreateCode?.id)
      throw new Error("Can't Send Sms,Please Call Administrator")

    return {
      statusCode: 200,
      data: {
        isSuccess: true,
        message: 'کد ارسال شد',
        phoneNumber: phoneNumberNewStyle,
        expireAt: utils.timestampToIso(Date.now() + 1000 * 60 * 2)
      },
      error: null
    }
  } catch (e) {
    return httpError(e)
  }
}

const check = async (
  phoneNumber,
  creatorId = null,
  isAdmin = true,
  isPasswordReset = false
) => {
  try {
    const creatorKey = isAdmin ? 'adminId' : 'userId'

    const where =
      creatorId === null && phoneNumber !== null
        ? {
            code: code,
            phoneNumber,
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
    return httpError(e)
  }
}

module.exports = {
  send,
  check
}
