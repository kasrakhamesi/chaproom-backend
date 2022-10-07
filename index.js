const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())

const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('./swagger-output.json')

app.use('/v1', require('./src/v1/routes'))
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('*', (req, res) => {
  res.status(404).send({
    statusCode: 404,
    data: null,
    error: {
      message: '404 Not Found',
      message_locale: 'صفحه یافت نشد'
    }
  })
})

app.listen(process.env.PORT)
