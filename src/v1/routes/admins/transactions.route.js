const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.put('/id/:id', admins.transactions.softDelete)
router.put('/id/:id', admins.transactions.update)
router.get('/id/:id', admins.transactions.findOne)
router.get('/', admins.transactions.findAll)
router.get('/', admins.transactions.create)

module.exports = router
