const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const findOne = async (req, res) => {
  try {
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findOne }
