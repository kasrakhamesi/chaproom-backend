const Types = {
  INVALID_PASSWORD: {
    statusCode: 400,
    message: 'رمزعبور اشتباه است'
  },
  INVALID_PHONE_PASSWORD: {
    statusCode: 400,
    message: 'رمزعبور یا نام کاربری اشتباه است'
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'دسترسی غیر مجاز'
  }
}

module.exports = Types
