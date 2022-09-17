const errors = require('../../errors')

module.exports = (req, res) => {
  res
    .status(errors.codes.errorsCode.unauthorized.statusCode)
    .send(errors.codes.errorsCode.unauthorized)
}
