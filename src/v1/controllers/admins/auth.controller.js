const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { authentications } = require('../../services')

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body
    const admin = await sequelize.models.admins.findOne({
      where: {
        phoneNumber,
        password
      }
    })
    if (!admin) return httpError(errorTypes.INVALID_USERNAME_PASSWORD, res)

    res.status(200).send({
      statusCode: 200,
      data: admin,
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const loginConfirm = (req, res) => {}

module.exports = { login, loginConfirm }
