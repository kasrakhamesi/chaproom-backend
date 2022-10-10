const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = (req, res) => {
  const {
    color,
    side,
    size,
    countOfPages,
    uploadedPages,
    binding,
    numberOfCopies,
    description,
    shipmentPrice,
    price,
    files
  } = req.body

  const userId = req?.user[0]?.id

  const data = {
    color,
    side,
    size,
    countOfPages,
    uploadedPages,
    binding,
    numberOfCopies,
    description,
    shipmentPrice,
    price,
    userId,
    files
  }
  return sequelize.models.folders
    .create(data)
    .then((r) => {
      return res.status(201).send({
        statusCode: 201,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findAll = (req, res) => {
  const userId = req?.user[0]?.id
  return sequelize.models.folders
    .findAll({
      where: {
        userId
      }
    })
    .then((r) => {
      return res.staus(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { create }
