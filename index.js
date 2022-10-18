const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())

const swaggerUi = require('swagger-ui-express')
const swaggerUserDocument = require('./swagger-output.json')

app.use('/v1', require('./src/v1/routes'))
app.use(
  '/v1/users/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerUserDocument)
)
app.use(
  '/v1/admins/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerUserDocument)
)

const { gateways } = require('./src/v1/libs')

const create = async () => {
  try {
    const zarinpal = gateways.zarinpal.create(
      process.env.ZARINPAL_MERCHANT,
      true
    )
    const payment = await zarinpal.PaymentRequest({
      Amount: '1000',
      CallbackURL: 'http://siamak.us',
      Description: 'Hello NodeJS API.',
      Email: 'hi@siamak.work',
      Mobile: '09120000000'
    })

    console.log(payment)
  } catch (e) {
    console.log(e)
  }
}

//create().then().catch()

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
