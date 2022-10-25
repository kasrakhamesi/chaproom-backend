const { Router } = require('express')
const router = Router()

router.use('/contact-us', require('./contactUs.route'))
router.use('/cooperations', require('./cooperations.route'))
router.use('/referrals', require('./referrals.route'))

module.exports = router
