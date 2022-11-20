const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.delete('/id/:id', admins.transactions.softDelete)
router.put('/id/:id', admins.transactions.update)
router.get('/id/:id', admins.transactions.findOne)
router.get('/', admins.transactions.findAll)
router.post('/', admins.transactions.create)
router.get('/total/ticker/:ticker', admins.transactions.totalTransactions)

module.exports = router
