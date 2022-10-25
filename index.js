const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()

app.use(cors())

app.use(logger('dev'))

const swaggerUi = require('swagger-ui-express')
const swaggerDocuments = {
  users: require('./docs/users.swagger.json'),
  admins: require('./docs/admins.swagger.json')
}

app.use('/v1', require('./src/v1/routes'))
app.use(
  '/v1/users/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocuments.users)
)

app.use(
  '/v1/admins/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocuments.admins)
)

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
