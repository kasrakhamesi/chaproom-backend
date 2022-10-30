const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.delete('/id/:id', admins.discounts.softDelete)
router.get('/id/:id', admins.discounts.findOne)
router.put('/id/:id', admins.discounts.update)
router.get('/', admins.discounts.findAll)

module.exports = router
