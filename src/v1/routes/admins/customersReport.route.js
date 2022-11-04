const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.get('/', admins.customersReport.findAll)
router.post('/excel', admins.customersReport.createExcel)

module.exports = router
