const { sequelize } = require('../models')

const randomString = () => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const discountCode = async (number = 1) => {
  const discountCodes = []
  while (true) {
    let code = randomString()
    try {
      if (discountCodes.length === number && number !== 1) return discountCodes

      const r = await sequelize.models.discounts.findOne({
        where: {
          code
        }
      })
      if (!r && number === 1) return code
      else if (!r) discountCodes.push(code)
    } catch {
      return code
    }
  }
}
const randomNumber = () =>
  String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)

module.exports = { discountCode, randomNumber }
