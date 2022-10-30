const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.put('/id/:id', admins.transactions.update)
router.get('/', admins.transactions.findAll)

module.exports = router
