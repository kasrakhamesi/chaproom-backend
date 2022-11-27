const errorTypes = require('../configs/errorTypes.config')

const Config = (err, res = null) => {
  if (err?.statusCode && res !== null)
    return res.status(err?.statusCode).send({
      statusCode: err?.statusCode,
      data: null,
      error: {
        message: err?.message || err?.error?.message,
        details: []
      }
    })
  else if (err?.statusCode)
    return {
      statusCode: err?.statusCode,
      data: null,
      error: {
        message: err?.message || err?.error?.message,
        details: []
      }
    }

  const details = []
  for (const entity in errorTypes) {
    if (String(err) !== entity) continue
    return res.status(entity.statusCode).send({
      statusCode: entity.statusCode,
      data: null,
      error: {
        message: entity.message,
        details
      }
    })
  }
  let message = err?.message || 'ورودی نامعتبر'
  if (err?.name === 'SequelizeValidationError') {
    for (const entity of err?.errors) {
      const errorMessage = entity.type.includes('notNull')
        ? 'نمیتواند خالی باشد '
        : 'معتبر نمیباشد '

      details.push({ [entity.path]: errorMessage })
    }
  } else if (err?.name === 'SequelizeUniqueConstraintError')
    message = 'این اطلاعات قبلا ساخته شده بود'

  if (res === null)
    return {
      statusCode: 400,
      data: null,
      error: {
        message,
        details
      }
    }

  return res.status(400).send({
    statusCode: 400,
    data: null,
    error: {
      message,
      details
    }
  })
}

module.exports = Config
