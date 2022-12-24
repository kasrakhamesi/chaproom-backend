const { sequelize } = require('../../models')
const { uniqueGenerates, regex, utils } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const { Op } = require('sequelize')
const soap = require('soap')
const _ = require('lodash')
require('dotenv').config()

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

    const oneTimeCode = uniqueGenerates.randomNumber()

    const args = {
      username: process.env.SMS98_USERNAME,
      password: process.env.SMS98_PASSWORD,
      pnlno: process.env.SMS98_FROM_NUMBER,
      mobileno: phoneNumber,
      text: `کد : ${oneTimeCode} \n چاپروم`,
      isflash: false
    }

    const client = await soap.createClientAsync(process.env.SMS98_URL)

    if (!client) return httpError(errorTypes.CONTACT_TO_ADMIN)

    const r = await client.SendSMSAsync(args)

    if (parseInt(r[0]?.SendSMSResult) !== 2)
      return httpError(errorTypes.CONTACT_TO_ADMIN)

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
          used: false,
          registerData: { [Op.not]: null }
        },
        order: [['id', 'DESC']]
      })
      if (!_.isEmpty(verify) && isAdmin === false) {
        body.registerData =
          process.env.RUN_ENVIRONMENT === 'local'
            ? JSON.parse(verify?.registerData)
            : verify?.registerData
      } else
        registerData && registerData !== null
          ? (body.registerData =
              process.env.RUN_ENVIRONMENT === 'local'
                ? JSON.stringify(registerData)
                : registerData)
          : null
    }

    const resCreateCode = await sequelize.models.verifies.create(body)

    if (!resCreateCode?.id) return httpError(errorTypes.CONTACT_TO_ADMIN)

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
    return httpError(e.message || String(e))
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
