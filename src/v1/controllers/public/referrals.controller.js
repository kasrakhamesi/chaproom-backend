const { httpError, messageTypes, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')

const increaseView = (req, res) => {
  const { slug } = req.body

  return sequelize.models.referrals
    .findOne({ where: { slug } })
    .then((r) => {
      if (!r) return httpError(errorTypes.SLUG_NOT_FOUND, res)
      r.update({
        viewCount: r?.viewCount + 1
      }).then(() => {
        return res
          .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
          .send(messageTypes.SUCCESSFUL_UPDATE)
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { increaseView }
