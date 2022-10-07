const jsonwebtoken = require('jsonwebtoken')
const adminAccess = 'qqqqq'
const userAccess = 'rrrr'
const userRefreshToken = 'refresh'

module.exports.adminJwt = ({
  id: id,
  roleId: roleId,
  phone: phone,
  password: password
}) => {
  return jsonwebtoken.sign(
    {
      id: id,
      roleId: roleId,
      phone: phone,
      password: password,
      isAdmin: true
    },
    adminAccess,
    { expiresIn: '3600000s' }
  )
}

const generateUserJwt = (id, phone) => {
  return jsonwebtoken.sign(
    {
      id,
      phone,
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
