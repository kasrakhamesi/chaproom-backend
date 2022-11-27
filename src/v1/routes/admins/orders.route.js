const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.get('/global', admins.orders.globalFindAll)
router.get('/user-id/:userId', admins.orders.findAllByUserId)
router.put('/id/:id', admins.orders.update)
router.get('/id/:id', admins.orders.findOne)
router.get('/', admins.orders.findAll)

module.exports = router
