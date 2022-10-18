const jsonwebtoken = require('jsonwebtoken')
const adminAccess = 'qqqqq'
const userAccess = 'rrrr'
const userRefreshToken = 'refresh'

module.exports.adminJwt = ({ id, roleId, phoneNumber, password }) => {
  return jsonwebtoken.sign(
    {
      id,
      roleId,
      phoneNumber,
      password,
      isAdmin: true
    },
    adminAccess,
    { expiresIn: '3600000s' }
  )
}

const generateUserJwt = (id, phoneNumber) => {
  return jsonwebtoken.sign(
    {
      id,
      phoneNumber,
      isAdmin: false
    },
    userAccess,
    { expiresIn: '3600000s' }
  )
}

const decodeJwt = (encodedString, isAdmin = true) => {
  return jsonwebtoken.decode(encodedString, isAdmin ? adminAccess : userAccess)
}

module.exports = { generateUserJwt, decodeJwt }
