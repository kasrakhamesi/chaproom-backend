const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.get('/id/:id', admins.withdrawals.findOne)
router.put('/id/:id', admins.withdrawals.update)
router.get('/', admins.withdrawals.findAll)

module.exports = router
