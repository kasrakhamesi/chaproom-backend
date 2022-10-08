const { sequelize } = require('../../models')

const login = (req, res) => {
  const { username, password } = req.body
  sequelize.models.admins.findOne({
    where: {
      username,
      password
    }
  })
}

module.exports = { login }
