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
/*
const pdfjsLib = require('pdfjs-dist')
pdfjsLib
  .getDocument(`C:/Users/Kasra/Downloads/f.pdf`)
  .promise.then(function (doc) {
    var numPages = doc.numPages
    console.log('# Document Loaded')
    console.log('Number of Pages: ' + numPages)
  })
*/
const fs = require('fs')
const pdf = require('pdf-page-counter')

let dataBuffer = fs.readFileSync(`C:/Users/Kasra/Downloads/w.pdf`)

pdf(dataBuffer).then(function (data) {
  // number of pages
  console.log(data.numpages)
  // number of rendered pages
})

//  var numPages = console.log('# Document Loaded') //doc.numPages
// console.log('Number of Pages: ' + numPages)

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
