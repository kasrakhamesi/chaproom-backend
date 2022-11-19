const { Router } = require('express')
const router = Router()

const { admins } = require('../../controllers')

router.get('/users-orders/ticker/:ticker', admins.dashboard.findUserOrder)
router.get('/users/ticker/:ticker', admins.dashboard.findUsers)
router.get('/orders/ticker/:ticker', admins.dashboard.findOrders)
router.get('/sales/ticker/:ticker', admins.dashboard.findSales)
router.get('/', admins.dashboard.findAll)

module.exports = router
