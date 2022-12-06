const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.put('/id/:id/cancel', users.orders.update)
router.get('/id/:id', users.orders.findOne)
router.post('/price-calculator', users.orders.priceCalculator)
router.get('/', users.orders.findAll)
router.post('/', users.orders.create)

module.exports = router
