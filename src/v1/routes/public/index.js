const { Router } = require('express')
const router = Router()

router.use('/contact-us', require('./contactUs.route'))
router.use('/cooperations', require('./cooperations.route'))
router.use('/referrals', require('./referrals.route'))
router.use('/tariffs', require('./tariffs.route'))

module.exports = router
