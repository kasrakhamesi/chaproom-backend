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
app.use('/v1/users/api-docs', swaggerUi.serve, (...args) =>
  swaggerUi.setup(swaggerDocuments.users)(...args)
)

app.use('/v1/admins/api-docs', swaggerUi.serve, (...args) =>
  swaggerUi.setup(swaggerDocuments.admins)(...args)
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

const t = {
  a3: {
    blackAndWhite: {
      singleSided: 480,
      doubleSided: 620,
      singleSidedGlossy: 0,
      doubleSidedGlossy: 0,
      breakpoints: [
        {
          at: 501,
          singleSided: 460,
          doubleSided: 580,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        },
        {
          at: 1001,
          singleSided: 430,
          doubleSided: 560,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        }
      ]
    }
  }
}

app.listen(process.env.PORT)
