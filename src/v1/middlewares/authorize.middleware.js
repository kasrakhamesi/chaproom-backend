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

module.exports.userJwt = ({ id: id, phone: phone }) => {
  return jsonwebtoken.sign(
    {
      id: id,
      phone: phone,
      isAdmin: false
    },
    userAccess,
    { expiresIn: '3600000s' }
  )
}

module.exports.userRefreshToken = ({ id: id, phone: phone }) => {
  return jsonwebtoken.sign(
    {
      id: id,
      phone: phone,
      isAdmin: false
    },
    userRefreshToken
  )
}

module.exports.decodeRefreshToken = (encodedString) => {
  return jsonwebtoken.decode(encodedString, userRefreshToken)
}

module.exports.decodeJwt = (encodedString, isAdmin = true) => {
  return jsonwebtoken.decode(encodedString, isAdmin ? adminAccess : userAccess)
}
