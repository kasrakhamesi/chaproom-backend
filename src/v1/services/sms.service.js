const { regex } = require('../../libs')
const { httpError, errorTypes } = require('../../configs')
const soap = require('soap')
const _ = require('lodash')
require('dotenv').config()

const send = async (phoneNumber, text) => {
  try {
    if (!regex.iranPhone(phoneNumber))
      return httpError(errorTypes.INVALID_PHONE_FORMAT)

    const args = {
      username: process.env.SMS98_USERNAME,
      password: process.env.SMS98_PASSWORD,
      pnlno: process.env.SMS98_FROM_NUMBER,
      mobileno: phoneNumber,
      text,
      isflash: false
    }

    const client = await soap.createClientAsync(process.env.SMS98_URL)

    if (!client) return httpError(errorTypes.CONTACT_TO_ADMIN)

    const r = await client.SendSMSAsync(args)

    if (parseInt(r[0]?.SendSMSResult) !== 2)
      return httpError(errorTypes.CONTACT_TO_ADMIN)

    return 'sms successfully sent'
  } catch (e) {
    return httpError(e.message || String(e))
  }
}

module.exports = {
  send
}
