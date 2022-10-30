const { httpError, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')

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

  return sequelize.models.print_tariffs
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
  return sequelize.models.print_tariffs
    .findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: _.isEmpty(r)
          ? null
          : r.map((item) => {
              return {
                id: item.id,
                type: item.type,
                size: item.size,
                single_sided: JSON.parse(item.single_sided),
                double_sided: JSON.parse(item.double_sided),
                single_sided_glossy: JSON.parse(item.single_sided_glossy),
                double_sided_glossy: JSON.parse(item.double_sided_glossy)
              }
            }),
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findAll, update }
