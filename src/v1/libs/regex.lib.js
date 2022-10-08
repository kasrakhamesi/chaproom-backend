const iranPhone = (phoneNumber) => {
  phoneNumber = parseInt(phoneNumber)
  const phoneRegex = /^(\+98|0098|98|0)?9\d{9}$/
  return phoneRegex.test(phoneNumber)
}

module.exports = { iranPhone }
