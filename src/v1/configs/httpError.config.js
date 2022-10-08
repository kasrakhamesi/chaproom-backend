const { errorTypes } = require('../configs')

const Config = (err, res = null) => {
  const details = []
  for (const entity in errorTypes) {
    console.log(String(err))
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
  if (err.name === 'SequelizeValidationError') {
    for (const entity of e.errors) {
      const errorMessage = entity.type.includes('notNull')
        ? [entity.path] + 'نمیتواند خالی باشد '
        : 'معتبر نمیباشد ' + [entity.path]

      details.push({ [entity.path]: errorMessage })
    }
  } else if (err.name === 'SequelizeUniqueConstraintError')
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
