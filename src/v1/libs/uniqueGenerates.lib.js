const { sequelize } = require('../models')

const randomString = () => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const discountCode = () => {
  while (true) {
    let code = randomString()
    sequelize.models.discounts
      .findOne({
        code
      })
      .then((r) => {
        if (!r) return code
      })
      .catch(() => {
        return code
      })
  }
}
const randomNumber = () =>
  String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)

module.exports = { discountCode, randomNumber }
