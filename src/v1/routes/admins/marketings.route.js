const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.get('/discounts', admins.marketings.findAllDiscounts)
router.get('/referrals', admins.marketings.findAllReferrals)

module.exports = router
