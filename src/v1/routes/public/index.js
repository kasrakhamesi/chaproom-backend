const { Router } = require('express')
const router = Router()

router.use('/contact-us', require('./contactUs.route'))
router.use('/affiliates', require('./affiliates.route'))
router.use('/referrals', require('./referrals.route'))

module.exports = router
