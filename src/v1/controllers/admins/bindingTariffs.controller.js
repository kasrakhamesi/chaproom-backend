const { httpError, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')

const update = (req, res) => {
  const {
    a4_springNormal,
    a5_springNormal,
    a3_springNormal,
    a5_springPapco,
    a4_springPapco,
    a3_springPapco,
    stapler
  } = req.body

  const data = {
    a4_springNormal,
    a5_springNormal,
    a3_springNormal,
    a5_springPapco,
    a4_springPapco,
    a3_springPapco,
    stapler
  }

  return sequelize.models.binding_tariffs
    .update(data, {
      where: { id: 1 }
    })
    .then(() => {
      return res
        .status(messageTypes.SUCCESSFUL_UPDATE)
        .send(messageTypes.SUCCESSFUL_UPDATE)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findAll = (req, res) => {
  return sequelize.models.binding_tariffs
    .findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'id']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findAll, update }
