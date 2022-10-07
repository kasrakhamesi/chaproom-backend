const { httpError, errorsType } = require('../../configs')

const unauthorized = (req, res) => {
  httpError(errorsType.UNAUTHORIZED, res)
}

module.exports = unauthorized
