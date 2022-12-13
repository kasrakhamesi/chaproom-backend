const { sequelize } = require('../../models')
const { uniqueGenerates, regex, utils } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
const _ = require('lodash')
const Kavenegar = require('kavenegar')
require('dotenv').config()
const api = Kavenegar.KavenegarApi({
  apikey: 'your apikey here'
})

const send = async ({
  phoneNumber,
  creatorId = null,
  isAdmin = true,
  isPasswordReset = false,
  registerData
}) => {
  try {
    if (!regex.iranPhone(phoneNumber))
      return httpError(errorTypes.INVALID_PHONE_FORMAT)

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
      where,
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
            phoneNumber,
            code: oneTimeCode,
            used: false,
            expireAt: utils.timestampToIso(Date.now() + 1000 * 60 * 2)
          }
        : {
            [creatorKey]: creatorId,
            phoneNumber,
            code: oneTimeCode,
            used: false,
            expireAt: utils.timestampToIso(Date.now() + 1000 * 60 * 2)
          }

    if (registerData !== null) {
      const verify = await sequelize.models.verifies.findOne({
        where: {
          phoneNumber,
          registerData: { [Op.not]: null }
        },
        order: [['id', 'DESC']]
      })
      if (!_.isEmpty(verify) && isAdmin === false)
        body.registerData =
          process.env.RUN_ENVIRONMENT === 'local'
            ? JSON.parse(verify?.registerData)
            : verify?.registerData
      else
        registerData && registerData !== null
          ? (body.registerData =
              process.env.RUN_ENVIRONMENT === 'local'
                ? JSON.stringify(registerData)
                : registerData)
          : null
    }

    console.log(body)

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

const check = async ({
  code,
  phoneNumber,
  creatorId = null,
  isAdmin = true,
  isPasswordReset = false
}) => {
  try {
    if (!regex.iranPhone(phoneNumber))
      return httpError(errorTypes.INVALID_PHONE_FORMAT)

    const creatorKey = isAdmin ? 'adminId' : 'userId'

    const where =
      creatorId === null && phoneNumber !== null
        ? {
            code,
            phoneNumber,
            used: false
          }
        : {
            [creatorKey]: creatorId,
            code,
            used: false
          }

    const verifyData = await sequelize.models.verifies.findOne({
      where,
      order: [['id', 'DESC']]
    })

    if (_.isEmpty(verifyData)) return httpError(errorTypes.INVALID_OTP)

    const passwordResetToken = uniqueGenerates.passwordResetToken(
      creatorId ? creatorId : 0
    )

    const updateData = isPasswordReset
      ? {
          passwordResetToken,
          used: true
        }
      : {
          used: true
        }

    await verifyData.update(updateData)

    const data = isPasswordReset
      ? {
          passwordResetToken,
          isSuccess: true,
          message: 'کد با موفقعیت تایید شد'
        }
      : {
          registerData:
            process.env.RUN_ENVIRONMENT === 'local'
              ? JSON.parse(JSON.parse(verifyData?.registerData))
              : verifyData?.registerData,
          isSuccess: true,
          message: 'کد با موفقعیت تایید شد'
        }

    return {
      statusCode: 200,
      data,
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
