const { sequelize } = require('../models')

const randomString = () => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
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

const passwordResetToken = (userId) =>
  `H${userId}${String(
    Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000
  )}B`

module.exports = { discountCode, randomNumber, passwordResetToken }
