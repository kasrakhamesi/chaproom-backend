const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.delete('/id/:id', users.folders.hardDelete)
router.put('/id/:id', users.folders.update)
router.get('/id/:id', users.folders.findOne)
router.post('/price-calculator', users.folders.priceCalculator)
router.get('/code', users.folders.findOrCreateOrder)
router.post('/', users.folders.create)
router.get('/', users.folders.findAll)

module.exports = router
