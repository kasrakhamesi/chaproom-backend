const { httpError, errorTypes } = require('../../configs')

const unauthorized = (req, res) => {
  return httpError(errorTypes.UNAUTHORIZED, res)
}

module.exports = unauthorized
